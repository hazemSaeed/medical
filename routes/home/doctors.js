const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const User = require('../../models/User')
const Reservation = require('../../models/Reservation')
const Appointment = require('../../models/Appointment')
const {userAuth} = require('../../helpers/authentication')
const moment = require('moment')
router.all('/*', (req,res,next) => {
    req.app.locals.layout = "home"
    next()
})

router.get('/', (req,res) => {
    User.find({isDoctor: true, isAdmin: false, status: 'approved'}).limit(6).sort({created: -1}).then(doctors => {
        res.render('home/doctors/index', {doctors: doctors})
    })
    
})

router.get('/search',(req,res)=>{
    let title = req.query.q;
    let reg = new RegExp('.*'+title+'.*','i');
    User.find({isDoctor: true, isAdmin: false, $or:[{username:reg}, {speciality: reg}, {country: reg}]}).sort({created:'desc'}).then(doctors => {
        res.render('home/doctors/search',
        {
            doctors: doctors
        })   
    }).catch(err => {
        res.redirect('/doctors')
    })
});

router.get('/profile/:id', (req, res) => {
    const id = req.params.id
    User.findById(id).then(doctor => {
        User.find({_id: { $nin: [id] }  ,speciality: doctor.speciality, isDoctor: true, isAdmin: false}).limit(6).then(doctorsSameSpeciality => {  
            Appointment.find({doctor: doctor.id}).then(appointments => {
                if(req.user && req.user.id === id){
                    res.render('home/doctors/profile', {user: doctor, appointments: appointments})
                }else res.render('home/doctors/profile', {doctor: doctor,  doctorsSameSpeciality:  doctorsSameSpeciality, appointments: appointments})    
            })
        })
    })   
  })

router.post('/get', (req, res)=> {
    User.find({isDoctor: true, isAdmin: false}).select(['username','speciality','country']).then(doctors=> {
        res.send({doctors: doctors})
    })
})

router.get('/appointment', userAuth, (req,res) => {
    let subject = '',dateFrom = '',dateTo = '',to = '',from = '', date= ''
    if(req.query.subject){
        subject = req.query.subject
    }
    if(req.query.start){
        dateFrom = new Date(req.query.start)
        from = moment(dateFrom).format('hh:mm')
        date = moment(dateFrom).format('YYYY-MM-DD')
    }
    if(req.query.end){
        dateTo = new Date(req.query.end)
        to = moment(dateTo).format('hh:mm')
    }
    res.render('home/doctors/appointment', {subject: subject, date: date, from: from, to: to})
})

router.post('/profile/contactDoctor', (req, res) => {
    const email = req.body.email
    const subject = req.body.subject
    const idDoctor = req.body.id
    const name = req.body.name
    const message = req.body.message

    User.findById(req.body.idDoctor).then(doctor => {
        if(!doctor) {
            req.flash('error_message', 'This doctor is not found')
            return res.redirect('/doctors')
        }
        else{
            const smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                  auth: {
                    user: 'hazemalb96@gmail.com',
                    pass: 'asd123456@'
                  }
              })
              const mailOptions = {
                to: doctor.email,
                from: email,
                subject: subject,
                text: 'Name : '+ name +'\n\n' +
                      'Email : ' + email +'\n\n' +
                      'Message : ' + message
              }
              smtpTransport.sendMail(mailOptions, function(err) {
                  if(err) return console.log(err);
                  
                req.flash('success_message', 'An message has been sent to ' + doctor.email + '.')
                res.redirect('/doctors/profile/'+doctor.id)
              });
        }
        

    })
    
})

router.post('/makeReservation', userAuth ,(req, res) => {
    let errors = []
    if(!req.body.doctor){
        errors.push({message: 'please, select a doctor'})
    }
    if(!req.body.date){
        errors.push({message: 'please, select date of your reservation'})
    }
    if(!req.body.dateFrom){
        errors.push({message: 'please, select start time of your reservation'})
    }
    if(!req.body.dateTo){
        errors.push({message: 'please, select end time of your reservation'})
    }
    if(req.body.dateFrom >= req.body.dateTo ){
        errors.push({message: 'please, select valid date reservation'})
    }
    if(!req.body.subject){
        errors.push({message: 'please, enter your subject'})
    }
    if(!req.body.message){
        errors.push({message: 'please, enter your message'})
    }
    if(errors > 0){
        res.render('home/doctors/appointement', {
            errors: errors
          })
    } else {
        // Get User
        User.findById(req.user).then(user => {
            if(!user) {
                req.flash('error_message','user not found')
                res.redirect('/doctors')
            }
            User.findOne({isDoctor: true, isAdmin: false, username: req.body.doctor}).then(doctor => {
                if(!doctor){
                    req.flash('error_message','doctor not found')
                    res.redirect('/doctors/appointment')
                }

                console.log('user', user)
                console.log('doctor', doctor)
                
                Reservation.find({doctor: doctor.id}).then(reservations => {

                    if(!reservations){
                        makeReservation(req, res, doctor, user)       
                    }
                    
                        console.log('reservations', reservations)
                        let reserved = false
                        reservations.forEach(reservation => {
                            if((new Date(reservation.date).getTime() === new Date(req.body.date).getTime()) && 
                                ((reservation.dateFrom === req.body.dateFrom) || (reservation.dateTo === req.body.dateTo) ||
                                (req.body.dateFrom < reservation.dateTo && req.body.dateFrom > reservation.dateFrom && req.body.dateTo >= reservation.dateTo) ||
                                (req.body.dateTo > reservation.dateFrom && req.body.dateTo < reservation.dateTo && req.body.dateFrom >= reservation.dateFrom) ||
                                (req.body.dateFrom > reservation.dateFrom && req.body.dateFrom < reservation.dateTo) ||
                                (req.body.dateTo < reservation.dateTo && req.body.dateTo > reservation.dateFrom ))){
                                reserved = true
                            }else {
                                reserved = false
                            }
                        })
                        if(reserved){ 
                            console.log('dateFrom && dateTo', req.body.dateFrom , req.body.dateTo)
                            req.flash('error_message','This appointment is reserved, please select other date')
                            res.redirect('/doctors/appointment')
                        }
                        else {makeReservation(req, res, doctor, user)}

                }).catch(err => {
                    req.flash('error_message','appointements: '+err)
                    makeReservation(req, res, doctor, user)
                })
            }).catch(err => {
                req.flash('error_message','doctor: '+err)
                res.redirect('/doctors/appointment')
            })
        }).catch(err => {
            req.flash('error_message', 'user: '+err)
            res.redirect('/doctors/appointment')
        })
    }
})

function makeReservation(req, res, doctor, user) {
    const newReservation = new Reservation({
        doctor: doctor.id,
        user: user.id,
        date: new Date(req.body.date),
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        subject: req.body.subject || '',
        message: req.body.message || ''
    })
    
    console.log('newReservation', newReservation)
    
    newReservation.save().then(reservationSaved => {
        req.flash('success_message',`Reservation ${reservationSaved.id} is added successfully, please review Dr ${doctor.username} profile`)
        res.redirect('/doctors/appointment')
    }).catch(err => {
        req.flash('error_message','error added '+ err)
        res.redirect('/doctors/appointment')
    })
    
}

module.exports = router