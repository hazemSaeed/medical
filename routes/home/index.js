const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const User = require('../../models/User')
const {userAuth} = require('../../helpers/authentication')
const {isEmpty,uploadDir} = require('../../helpers/upload-helper')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Prescription = require('../../models/Prescription')
const fs = require('fs')
const Category = require('../../models/Category')
const Contact = require('../../models/Contact')
const async = require("async")
const nodemailer = require('nodemailer')
const moment = require('moment')
const unirest = require('unirest')
const Appointment = require('../../models/Appointment')
const Reservation = require('../../models/Reservation')
const Rating = require('../../models/Rating')
// Routes All with Layout Home
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home'
  next()
})

// Route Home Page
router.get('/', (req, res) => {
  let allCategories,
      latestPrescription,
      hair_care,
      skin_care,
      disposeOfProblem,
      weight_control,
      skin_problem,
      rating_user

      async.series([
      function(callback){
      if(req.user){
        Rating.find({user: req.user.id}).then(userRating => {
          rating_user = userRating
          callback(null, rating_user)
        })
      }else {
        rating_user = []
        callback(null, rating_user)
      }  
        
      },
      function(callback){
        Prescription.find({}).sort({published: -1}).limit(8).then(latestPrescriptions => {
          latestPrescription = latestPrescriptions
          callback(null,latestPrescription)
        })
      },
      function(callback){
        Category.find({},{"_id": 1, "category": 1}).limit(5).then(categories => {
          allCategories = categories
          callback(null,allCategories)
        })
      },
      function(callback){
        Category.find({category: 'Hair Care'}).then(categorySelected => {
          Prescription.find({category: categorySelected[0]._id}).sort({published: -1}).populate('category').then(prescriptions => {
            hair_care = prescriptions
            callback(null, hair_care)
          })
        })
      },
      function(callback){
        Category.find({category: 'Skin Care'}).then(categorySelected=> {
          Prescription.find({category: categorySelected[0]._id}).sort({published: -1}).populate('category').then(prescriptions => {
            skin_care = prescriptions
            callback(null, skin_care)
          })
        })
      },
      function(callback){
        Category.find({category: 'Dispose of Problem'}).then(categorySelected=> {
          Prescription.find({category: categorySelected[0]._id}).sort({published: -1}).populate('category').then(prescriptions => {
            disposeOfProblem = prescriptions        
            callback(null, disposeOfProblem)
          })
        })
      },
      function(callback){
        Category.find({category: 'Weight Control'}).then(categorySelected=> {
          Prescription.find({category: categorySelected[0]._id}).sort({published: -1}).then(prescriptions => {
            weight_control = prescriptions
            callback(null, weight_control)  
          })
        })
      },
      function(callback){
        Category.find({category: 'Skin Problem'}).then(categorySelected=> {
          Prescription.find({category: categorySelected[0]._id}).sort({published: -1}).populate('category').then(prescriptions => {
            skin_problem = prescriptions
            callback(null, skin_problem)
          })
        })
      }
    
    ], function(err){  
      res.render('home/index',
      {
        rating_user: rating_user,
        categories: allCategories,
        latestPrescriptions: latestPrescription,
        hair_care: hair_care,
        skin_care: skin_care,
        disposeOfProblem: disposeOfProblem,
        weight_control: weight_control,
        skin_problem: skin_problem,
        removeError: true 
      })
    })

})

// Search About Disease
router.get('/searchDisease', (request, response) => {
  const disease = request.query.disease
  let reg = new RegExp('.*'+disease+'.*','i')
  let diseases = []
  // GET All Issues
  const req = unirest("GET", "https://priaid-symptom-checker-v1.p.rapidapi.com/issues")
  req.query({"language":"en-gb"})
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});
  req.end( res => {
    if (res.error) 
      response.send({error: res.error});
    for (let i = 0; i < res.body.length; i++) {
      const name = res.body[i].Name.toLowerCase()
      if(name.match(reg)){
        diseases.push(res.body[i])
      }
    }
    
    response.render('home/disease',{diseases: diseases})
  })
})

router.get('/profile', userAuth, (req,res) => {
  User.findById(req.user.id).then(user => {
  if(user.isDoctor){
    
    if(user.attachment === null && user.status === 'pending') {
      res.render('home/doctors/profile',{user: user,error: 'Please, you must attach your certificate to approve your account'})
    }
    else if(user.attachment !== null && user.status === 'pending'){
      res.render('home/doctors/profile',{user: user,success_message: 'Your account is being reviewed'})
    }else if(user.attachment !== null && user.status === 'denied'){
      res.render('home/doctors/profile',{user: user,error_message: 'Please, change your certificate to approve your account'})
    }
    
    else {
      Appointment.find({doctor: user.id}).then(appointments => {
        res.render('home/doctors/profile',{user: user, appointments: appointments})
    })
    }
    
  }else if(user.isAdmin){
    res.redirect('/admin')
  }else {
    res.render('home/users/profile',{user: user})
  }
})
})

router.get('/settings', userAuth, (req,res) => {
  User.findById(req.user.id).then(user => {
    if(user.isDoctor){
      if(user.attachment === null && user.status === 'pending') {
        res.render('home/doctors/settings',{user: user, error: 'Please, you must attach your certificate to approve your account'})
      }
      else if(user.attachment !== null && user.status === 'pending'){
        res.render('home/doctors/settings',{user: user, success_message: 'Your account is being reviewed'})
      }else if(user.attachment !== null && user.status === 'denied'){
        res.render('home/doctors/settings',{user: user, error_message: 'Please,change your certificate to approve your account'})
      }
      
      else {
        Appointment.find({doctor: user.id}).then(appointments => {
          res.render('home/doctors/settings',{user: user, appointments: appointments})
        })
      }
    }
      else if(user.isAdmin){
      res.redirect('/admin/settings')
    }else{
      res.render('home/users/settings',{user: user})
    }
  }).catch(err => {
    res.redirect('/')
  })
  
})

router.post('/reservationsDoctor', (req, res) => {
  const id = req.body.id 
  Reservation.find({doctor: id}).then(reservations => {
    console.log(reservations);
    res.send({reservations: reservations})
  }).catch(err => {
    if(req.user && req.user.isDoctor === true){
      Reservation.find({doctor: req.user.id}).then(reservations => {
        res.send({reservations: reservations})
      })
    }
    
  })
})

router.get('/reservations/view/:idDoctor/:idReservation',userAuth , (req, res) => {
  const idDoctor = req.params.idDoctor
  const idReservation = req.params.idReservation

  User.find({isAdmin: false, isDoctor: true, _id: idDoctor}).then(doctor => {
    if(!doctor){
      req.flash('error_message','this is not doctor or doctor not found')
      res.redirect('/doctors')
    }
    console.log(doctor);
    
    Reservation.findById(idReservation).populate('user').populate('doctor').then(reservation => {
      if(!reservation) {
        req.flash('error_message','reservation not found')
        res.redirect('/doctors')
      }
      console.log(reservation);
      
      if(req.user.id === reservation.doctor.id || req.user.id === reservation.user.id){
        res.render('home/doctors/reservations/view',{reservation: reservation})
      }else {
        req.flash('error_message','not authorize to view this reservation')
        res.redirect('/doctors/profile/'+reservation.doctor._id)
      }

    }).catch(err => {
      req.flash('error_message','reservation not found')
      res.redirect('/doctors')
    })
  }).catch(err => {
    req.flash('error_message','this is not doctor or doctor not found')
    res.redirect('/doctors')
  })
  
})

router.post('/reservation/delete', (req, res) => {
  if(req.body.id){
    Reservation.findByIdAndDelete(req.body.id).then(reservationDeleted => {
      req.flash('success_message', `Reservation ${reservationDeleted.id} is deleted successfully`)
      res.send({reservation: reservationDeleted})
    })
  }
})

// Route Policy
router.get('/policy', (req, res) => {
  res.render('home/policy')
})

// Route 404 Page
router.get('/404', (req, res) => {
  res.render('home/404')
})

router.post('/rating', userAuth, (req, res)=> {
  const idUser = req.body.user
  const idPrescription = req.body.prescription
  Rating.findOne({user: idUser, prescription: idPrescription}).then(rate => {
    if(rate){
      rate.remove().then(rateRemoved => {
          Prescription.findById(idPrescription).then(prescription => {
            prescription.rating = prescription.rating - 1
            prescription.save().then(prescriptionSaved => {
              res.send({prescription: prescriptionSaved, removeClick: true})
            })
        })
      })
      
    }else {
      const newRate = new Rating({
        prescription: idPrescription,
        user: idUser
      })
      newRate.save().then(rateSaved => {
        Prescription.findById(idPrescription).then(prescription => {
          prescription.rating = prescription.rating +1
          prescription.save().then(prescriptionSaved => {
            res.send({prescription: prescriptionSaved,removeClick: false})
            
          })
        })
      })
    }
  })
  
})

router.post('/settings/updateImage/:id',userAuth, (req, res) => {
  let errors = []
  if(!isEmpty(req.files)){
      let extension = ['png','jpg','svg','ico','jpeg','gif'];
      let fn = req.files.image.name;
      let ext = fn.substring(fn.indexOf('.')+1);
      let img_ext = extension.includes(ext); 
      if(img_ext == false){
          errors.push({message: 'please enter validate image'});
      }
    }
    if(errors.length > 0) {
      response.render('users/settings',{
        errors: errors
      })
    }else {
      User.findById(req.user.id).then(user => {
          let filename = user.image
          if(!isEmpty(req.files)){
              let file = req.files.image;
              filename = Date.now()+'_'+file.name;

              file.mv('./public/uploads/users/'+ filename,err=>{
                  if(err) throw err;
              });
              if(user.image !== 'avatar.png'){
                fs.unlink(uploadDir +'uploads/users/'+ user.image,(err)=>{ });
              }
          }
          user.image = filename;
          user.save().then(userUpdated=>{
              req.flash('success_message',`User ${userUpdated.email} was updated image profile successfully`);
              res.redirect('/settings');
          }).catch(err=>{
            req.flash('error_message',`error for uploading image`);
            res.redirect('/settings');
          });
      });
    }  
})

router.post('/settings/certificate/:id',userAuth, (req, res) => {
  let errors = []
  if(!isEmpty(req.files)){
      let extension = ['png','jpg','svg','ico','jpeg','gif'];
      let fn = req.files.uploadcertificate.name;
      let ext = fn.substring(fn.indexOf('.')+1);
      let img_ext = extension.includes(ext); 
      if(img_ext == false){
          errors.push({message: 'please enter validate image'});
      }
    }
    if(errors.length > 0) {
      res.render('home/doctors/settings',{
        errors: errors
      })
    }else {
      User.findById(req.user.id).then(user => {
          let filename = user.attachment
          if(!isEmpty(req.files)){
              let file = req.files.uploadcertificate;
              filename = Date.now()+'_'+file.name;

              file.mv('./public/uploads/attachments/'+ filename,err=>{
                  if(err) throw err;
              });
              if(user.attachment){
                fs.unlink(uploadDir +'uploads/attachments/'+ user.attachment,(err)=>{ res.render('home/doctors/settings', {error: err});});
              }
          }
          user.attachment = filename;
          user.save()
          .then(userUpdated => {
              req.flash('success_message',`User ${userUpdated.email} was update certificate successfully`);
              res.redirect('/settings');
          }).catch(err=>{
              res.render('home/doctors/settings', {error: err});
          });
      });
    }  
})

router.post('/settings/basic/:id',userAuth, (req, res) => {

    User.findById(req.user.id).then(user => {   
        user.phone = req.body.phone || req.user.phone
        user.country = req.body.country || req.user.country
        user.description = req.body.description || req.user.description
        user.speciality = req.body.specialty || req.user.speciality
        user.education = req.body.education || req.user.education
        user.save().then(userUpdated=>{
            req.flash('success_message',`User ${userUpdated.email} was update profile successfully`);
            res.redirect('/settings');
        }).catch(err=>{
            res.render('users/settings', function () {
              req.flash('error_message',err)
            });
        });
    });
})

router.post('/settings/changePassword/:id',userAuth, (req, response) => {
  let errors = []
  if(!req.body.oldpassword) errors.push({message: 'please enter old password'})
  if(!req.body.newpassword) errors.push({message: 'please enter new password'})
  if(!req.body.verifypassword) errors.push({message: 'please enter verify password'})
  if(req.body.verifypassword !== req.body.newpassword) errors.push({message: 'password not match'})
  if(errors.length > 0) {
    response.render('admin/settings',{
      errors: errors
  })
  }
  else {
    User.findOne({_id: req.params.id, isAdmin: false}).then(user => {
      bcrypt.compare(req.body.oldpassword, req.user.password, function(err, res) {
        if(res){
          user.password = req.body.newpassword
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash
              user.save().then(savedUser => {
                req.flash('success_message', 'You are upadte password successfully');
                response.redirect('/settings');
              })
            })
          })
         
        } else {
          req.flash('error_message',`passwords do not match`);
          response.redirect('/settings')
        }
      });
    }).catch(err => {
      req.flash('error_message',err)
      res.redirect('/settings')
    })
  }
  
})

router.post('/settings/links/:id',userAuth, (req, res) => {

  User.findById(req.user.id).then(user => {        
      user.twitter = req.body.twitter || req.user.twitter
      user.skype = req.body.skype || req.user.skype
      user.facebook = req.body.facebook || req.user.facebook
      user.instagram = req.body.instagram || req.user.instagram
      user.linkedin = req.body.linkedin || req.user.linkedin
      user.save().then(userUpdated=>{
          req.flash('success_message',`User ${userUpdated.email} was update profile successfully`);
          res.redirect('/settings');
      }).catch(err=>{
          res.render('users/settings', function () {
            req.flash('error_message',err)
          });
      });
  });
})

router.post('/settings/delete/:id',userAuth, (req, res) => {
  User.findById(req.user.id).then(user => {
    if(user.image !== 'avatar.png')
    fs.unlink(uploadDir+'uploads/users/'+user.image,err=> {
    });
    if(user.attachment)
    fs.unlink(uploadDir+'uploads/attachments/'+user.attachment,err=> {
    });

    if(user.isDoctor){
      Appointment.find({doctor: user.id}).then(appointments => {
        appointments.forEach(appointment => {
          appointment.remove()
        })
      })
    }
    req.logout();
    req.flash({'success_message':`User ${user.id} is removed successfully`});
    user.remove();
    res.redirect('/');
  }).catch(err => {
    req.flash('error_message',err);
    res.redirect('/settings')
  })
})

router.post('/settings/manage/:id',userAuth, (req, res) => {
  const id = req.params.id
  const appointment = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  User.findById(id).then(user => {
    for (let i = 0; i < appointment.length; i++) {
      Appointment.findById(req.body.id[i]).then(updateAppointment => { 
        const timeTo = req.body.to[updateAppointment.id] ? new Date('Mon 03-Jul-2019,' + req.body.to[updateAppointment.id]) : updateAppointment.to
        const timeFrom = req.body.from[updateAppointment.id] ? new Date('Mon 03-Jul-2019,' + req.body.from[updateAppointment.id]) : updateAppointment.from
        const holiday = req.body.holiday[updateAppointment.id] && (req.body.holiday[updateAppointment.id])  === 'on' ? true : false
        updateAppointment.from = timeFrom
        updateAppointment.to = timeTo
        updateAppointment.isHoliday = holiday

        updateAppointment.save()
      })
    }
    req.flash('success_message', 'update appointement successfully')
    res.redirect('/settings')
  }).catch(err => {
    req.flash('error_message' ,'error updated due to '+ err)
    res.redirect('/settings')
  })
})

// Route Reset Password
router.get('/reset', (req, res) => {
  res.render('home/resetPassword')
})

router.post('/resetPassword', (req, res,next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/reset');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hazemalb96@gmail.com',
          pass: 'asd123456@'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Medical Care Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
    
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });  
})

router.get('/reset/:token', (req, res) => {
  User.find({resetPasswordToken: req.params.token}).then(user => {
    const date = moment(Date.now()).format('YYYY/MM/DD hh:mm:ss')

    const expired = moment(user[0].resetPasswordExpires).format('YYYY/MM/DD hh:mm:ss')
    if(new Date(expired).getTime() >= new Date().getTime()){
      res.render('home/resetPassword', {error_message: 'reset password expired'})
    }else {
      res.render('home/recoverPassword',{token: req.params.token})
    }
  }).catch(err => {
    res.render('home/resetPassword',{error_message: 'This token is expired'})
  })
})

router.post('/recover', (req,res) => {
  const token = req.body.token
  const newPass = req.body.password
  User.findOne({resetPasswordToken: token}).then(user => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPass, salt, (err, hash) => {
        user.password = hash;
        user.resetPasswordExpires = null
        user.resetPasswordToken = null
        user.save().then(savedUser => {
            req.flash('success_message', 'You are reset password now, please login');
            res.redirect('/reset');
          }).catch(err => {
            req.flash('error_message',''+err)
            res.redirect('/reset')
          })
      });
    });
  })
})

router.post('/recievePrescription', (req, res) => {
  Contact.findOne({email: req.body.email}).then(contact => {
    if(contact) {
      // req.flash('error_message', 'That email exist, please add another email');
      res.redirect('/');
    }
    const newContact = new Contact({
      email: req.body.email
    })
    newContact.save().then(contactSaved => {
      // req.flash('success_message','added successfully');
      res.redirect('/')
      
    }).catch(err => {
      // req.flash('error_message','error to add this email');
      res.redirect('/')
    })
  })
})

// Passport LocalStrategy for User
passport.use( 'user', new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  User
    .findOne({email: email})
    .then(user => {
      if (!user) {
        return done(null, false, {message: 'Incorrect Email'});
      }
      bcrypt.compare(password, user.password, (err, matched) => {
        if (err) 
          return err;
        if (matched) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect Password'});
        }
      });
    });
}))

// Passport Serialize User
passport.serializeUser(function (user, done) {
  done(null, user.id);
})

// Passport Deserialize User
passport.deserializeUser(function (id, done) {
  User
    .findById(id, function (err, user) {
      done(err, user);
    })
})

// Route Get Login For Admin
router.get('/admin/login', (req, res, next) => {
  if(req.isAuthenticated()){
    res.redirect('/admin')
    return next()
  }
  res.render('admin/login', {layout: 'login'})
})
// Route Get Logout For Admin
router.get('/admin/logout', (req, res) => {
    req.logout();
    res.redirect('/admin/login');
})
// Route Post Login For Admin
router.post('/admin/login', (req, res, next) => {
    passport.authenticate('user', {
      successRedirect: '/admin',
      failureRedirect: '/admin/login',
      failureFlash: true,
    })(req, res, next);

})

// Route Post Login For User
router.post('/login', (req, res, next) => {
  passport.authenticate('user', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
})

// Route Get Logout For User
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// Register User Form
router.post('/register-user', (req, res) => {
  let errors = [];
  if (!req.body.usernameU) {
    errors.push({message: 'please enter your username'});
  }
  if (!req.body.emailU) {
    errors.push({message: 'please enter your email'});
  }
  if (!req.body.passwordU) {
    errors.push({message: 'please enter your password'});
  }
  if (!req.body.cpasswordU) {
    errors.push({message: 'please enter your password confirm'});
  }
  if (req.body.passwordU !== req.body.cpasswordU) {
    errors.push({message: 'password not match'});
  }
  if (errors.length > 0) {
    res.render('home/index', {
      errors: errors,
      username: req.body.usernameU,
      email: req.body.emailU
    });
  } else {
    User
      .findOne({email: req.body.emailU})
      .then(user => {
        if (user) {
          req.flash('error_message', 'That email exist, please login');
          // res.redirect('/');
        } else {
          const newUser = new User({username: req.body.usernameU, email: req.body.emailU, password: req.body.passwordU, userType: 'user'});
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser
                .save()
                .then(savedUser => {
                  req.flash('success_message', 'You are now registered, please login');
                  res.redirect('/');
                });
            });
          });
        }
      });

  }

})

// Register Doctor Form
router.post('/register-doctor', (req, res) => {
  let errors = [];
  if (!req.body.usernameD) {
    errors.push({message: 'please enter your Username'});
  }
  if (!req.body.emailD) {
    errors.push({message: 'please enter your Email'});
  }
  if (!req.body.speciality) {
    errors.push({message: 'please enter your Speciality'});
  }
  if (!req.body.passwordD) {
    errors.push({message: 'please enter your Password'});
  }
  if (!req.body.cpasswordD) {
    errors.push({message: 'please enter your Password Confirm'});
  }
  if (req.body.passwordD !== req.body.cpasswordD) {
    errors.push({message: 'Password not match'});
  }
  if (errors.length > 0) {
    res.render('home/index', {
      errors: errors,
      username: req.body.usernameD,
      email: req.body.emailD
    });
  } else {
    User
      .findOne({email: req.body.emailD})
      .then(user => {
        if (user) {
          req.flash('error_message', 'That email exist, please login');
          res.redirect('/');
        } else {
          const newUser = new User({username: req.body.usernameD, email: req.body.emailD, password: req.body.passwordD, isDoctor: true, speciality: req.body.speciality});
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser
                .save()
                .then(savedUser => {
                  req.flash('success_message', 'You are now registered, please login');
                  res.redirect('/');

                  // Add Default Appointment for Doctors
                  const appointment = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                  for (let i = 0; i < appointment.length; i++) {
                    const newAppointment = new Appointment({
                      doctor: savedUser.id,
                      day: appointment[i],
                      from: new Date('Mon 03-Jul-2017, 8:00 AM'),
                      to: new Date('Mon 03-Jul-2017, 3:00 PM'),
                      isHoliday: appointment[i] === 'friday' ? true : false
                    })  
                    
                    newAppointment.save()
                  }
                });
            });
          });
        }
      });

  }
})

module.exports = router