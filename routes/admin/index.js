const express = require('express');
const router = express.Router();
const {uploadDir, isEmpty} = require('../../helpers/upload-helper')
const {requiresAdmin} = require('../../helpers/authentication')
const User = require('../../models/User')
const Prescription = require('../../models/Prescription')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const async = require('async')

router.all('/*', requiresAdmin(), (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

router.get('/',(req, res) => {  
  let allUsers,
      allDoctors,
      allPrescription,
      countUser,
      countDoctor,
      countPrescription
      

      async.series([
      function(callback){
        Prescription.find({}).sort({published: -1}).limit(4).then(latestPrescriptions => {
          allPrescription = latestPrescriptions
          callback(null,allPrescription)
        })
      },
      function(callback){
        Prescription.countDocuments().then(prescriptionCount => {
          countPrescription = prescriptionCount
          callback(null,countPrescription)
        })
      },
      function(callback){
        User.find({isAdmin: false, isDoctor: false}).sort({created: -1}).limit(8).then(latestUser => {
          allUsers = latestUser
          callback(null,allUsers)
        })
      },
      function(callback){
        User.find({isAdmin: false, isDoctor: false}).countDocuments().then(userCount => {
          countUser = userCount
          callback(null,countUser)
        })
      },
      function(callback){
        User.find({isAdmin: false, isDoctor: true}).sort({created: -1}).limit(8).then(latestDocotr => {
          allDoctors = latestDocotr
          callback(null,allDoctors)
        })
      },
      function(callback){
        User.find({isAdmin: false, isDoctor: true}).countDocuments().then(doctorCount => {
          countDoctor = doctorCount
          callback(null,countDoctor)
        })
      }
    
    ], function(err){    
      res.render('admin/index',
      {
        value: '/admin',
        users: allUsers,
        doctors: allDoctors,
        prescriptions: allPrescription,
        countDoctor: countDoctor,
        countUser: countUser,
        countPrescription: countPrescription,
      })
    })
})

router.get('/settings', (req, res) => {
  res.render('admin/settings',{value: '/admin/settings'});
})

router.post('/settings/:id',(req,res) => {
  let errors = [];
    if(!isEmpty(req.files)){
        let extension = ['png','jpg','svg','ico','jpeg','gif'];
        let fn = req.files.image.name;
        let ext = fn.substring(fn.indexOf('.')+1);
        img_ext = extension.includes(ext);      
        if(img_ext == false){
            errors.push({message: 'please enter validate image'});
        }
    }
    if(errors.length > 0){
        res.render('admin/settings',{
            errors: errors,
            phone: req.body.phone || req.user.phone,
            loaction: req.body.loaction || req.user.country,
            descrtption: req.body.description || req.user.description
        });
    }else{
        User.findById(req.params.id).then(user => {
            user.phone = req.body.phone || user.phone
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
            user.country = req.body.location || user.country;
            user.description = req.body.description || user.description

            user.save().then(userUpdated=>{
                req.flash('success_message',`User ${userUpdated.email} was updated profile successfully`);
                res.redirect('/admin');
            }).catch(err=>{
                res.render('admin/settings', function () {
                  console.log(err)
                });
            });
        });
    }    
})

router.post('/settings/changePassword/:id', (req, response) => {
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
    User.findOne({_id: req.params.id, isAdmin: true}).then(user => {
      bcrypt.compare(req.body.oldpassword, req.user.password, function(err, res) {
        if(res){
          user.password = req.body.newpassword
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              user.password = hash
              user.save().then(savedUser => {
                req.flash('success_message', 'You are upadte password successfully');
                response.redirect('/admin/settings');
              })
            })
          })
         
        } else {
          req.flash('error_message',`passwords do not match`);
          response.redirect('/admin/settings')
        }
      });
    }).catch(err => {
      console.log(err)
    })
  }
  
})

module.exports = router;