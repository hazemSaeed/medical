const express = require('express')
const router = express.Router();
const User = require('../../models/User')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

router.get('/',(req, res) => { 
  User.find({isDoctor: false, isAdmin: false}).then(users => {
    res.render('admin/users/index',{value: '/admin/users', users: users})
  }) 
})

router.get('/edit/:id', (req, res) => {
  User.findById(req.params.id).then(user => {
    if(user) {
      res.render('admin/users/edit', {value: '/admin/users', editUser: user})
    }
  }).catch(err => {
    res.redirect('/admin/users')
  })
})

router.post('/edit/:id', (req,res) => {
  User.findById(req.params.id).then(user => {
    user.status = req.body.status
    user.save().then(userUpdated => {
      req.flash('success_message',`User ${userUpdated.email} was updated status successfully`)
      res.redirect('/admin/users')
    }).catch(err => {
      console.log(err);
      
    })
  }).catch(err => {
    console.log(err)
    
  })
})

module.exports = router