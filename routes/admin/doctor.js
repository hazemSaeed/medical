const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const { uploadDir } = require('../../helpers/upload-helper')
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
});

router.get('/',(req, res) => { 
  User.find({isDoctor: true, isAdmin: false}).then(doctors => {
    res.render('admin/doctors/index',{value: '/admin/doctors', doctors: doctors})
  }) 
})

router.get('/edit/:id', (req, res) => {
  User.findById(req.params.id).then(user => {
    if(user) {
      res.render('admin/doctors/edit', {value: '/admin/doctors', editUser: user})
    }
  }).catch(err => {
    res.redirect('/admin/doctors')
  })
})

router.get('/download/:img',(req, res) => {
  var file = req.params.img;
  var fileLocation = uploadDir+'uploads/attachments/'+file;
  res.download(fileLocation, file);

})

router.post('/edit/:id', (req,res) => {
  User.findById(req.params.id).then(user => {
    user.status = req.body.status
    if(req.body.status === 'approved'){
      user.isActive = true
    }
    user.save().then(userUpdated => {
      req.flash('success_message',`Doctor ${userUpdated.email} was updated status successfully`);
      res.redirect('/admin/doctors')
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  })
})

module.exports = router