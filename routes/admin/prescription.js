const express = require('express');
const router = express.Router();
const Prescription = require('../../models/Prescription')
const Preparation = require('../../models/Preparation')
const Category = require('../../models/Category')
const {isEmpty,uploadDir} = require('../../helpers/upload-helper')
const fs = require('fs')
const Contact = require('../../models/Contact')
const nodemailer = require('nodemailer')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

router.get('/',(req, res) => {  
  Prescription.find({}).sort({published: -1}).populate('category').then(prescriptions => {
    res.render('admin/prescriptions/index',{prescriptions: prescriptions, value: '/admin/prescriptions'})
  })  
})

router.get('/add',(req, res) => {  
  Category.find({}).then(categories=> {
    res.render('admin/prescriptions/add',{categories: categories, value: '/admin/prescriptions'})
  })

})

router.post('/add',(req, res) => {  
  let errors = []
    if(!req.body.title){
        errors.push({message: 'please enter the prescription title'})
    }
    if(!req.body.description){
        errors.push({message: 'please enter description'})
    }
    if(!req.body.category){
      errors.push({message: 'please enter category'})
    }
    if(!isEmpty(req.files)){
        let extension = ['png','jpg','svg','ico','jpeg','gif'];
        let fn = req.files.image.name;
        let ext = fn.substring(fn.indexOf('.')+1)
        let img_ext = extension.includes(ext) 
        if(img_ext == false){
            errors.push({message: 'please enter valid image'})
        }
    }
    if(!req.body.name && !req.body.preparation){
      errors.push({message: 'please add at least one method'})
    }
    if(errors.length > 0){
        res.render('admin/prescriptions/add',{errors:errors})
    }else{
        let imageprescription = 'image'
        if(!isEmpty(req.files)){
            let file = req.files.image;
            imageprescription = Date.now()+'_'+file.name

            file.mv('./public/uploads/bg-precreption/'+ imageprescription,err=>{
                if(err) throw err
            });

        }
        const newPrescription = new Prescription({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            image: imageprescription
        });

        // Variable preparations be array object of prep 
        let preparations = [];

        newPrescription.save().then(prescriptionSaved=>{

            if(Array.isArray(req.body.name)){
              for (let i = 0; i < req.body.name.length; i++) {
                
                preparations[i] = {
                  prescription: prescriptionSaved.id,
                  name: req.body.name[i],
                  howToPrepare: req.body.preparation[i],
                  ingredients: req.body.ingredients[i]
                }
              }
            preparations.forEach(element => {
              Preparation.findById(element.id).then(preparation => {
                if(preparation) {
                  req.flash('error_message', 'That preparation exist');
                  res.redirect('/admin/prescriptions/add');
                }
                const newPreparation = new Preparation({
                  prescription: element.prescription,
                  name: element.name,
                  howToPrepare: element.howToPrepare,
                  ingredients: element.ingredients || ''
                })

                newPreparation.save();
              })
            });
            
            }else {
              const newPreparation = new Preparation({
                prescription: prescriptionSaved.id,
                name: req.body.name,
                howToPrepare: req.body.preparation,
                ingredients: req.body.ingredients || ''
              })

              newPreparation.save();
            }
            
            req.flash('success_message',`Prescription is added successfully`);
            res.redirect('/admin/prescriptions');

            Contact.find({}).then(contacts => {
              contacts.forEach(contact => {
                const smtpTransport = nodemailer.createTransport({
                  service: 'gmail',
                    auth: {
                      user: 'hazemalb96@gmail.com',
                      pass: 'asd123456@'
                    }
                })
                const mailOptions = {
                  to: contact.email,
                  from: 'passwordreset@demo.com',
                  subject: 'Latest Prescription',
                  text: 'You are receiving latest prescription that added in medical care website \n\n' +
                    'Please click on the link, to view that new prescription:\n\n' +
                    'http://' + req.headers.host + '/prescriptions/view/' + prescriptionSaved.id + '\n\n'

                }
                smtpTransport.sendMail(mailOptions, function(err) {
                  req.flash('success_message', 'An prescription has been sent to ' + contact.email + '.');
                  
                });
              })
              
            })  
        }).catch(err=>{
            res.render('admin/prescriptions/add', {err:'error add'});
        });
        
    }
})

router.get('/edit/:id',(req, res) => {  
  const id = req.params.id
  Prescription.findById(id).then(prescription => {
    Preparation.find({prescription: prescription.id}).then(preparations => {
      Category.find({}).then(categories => {
      res.render('admin/prescriptions/edit',{prescription: prescription, preparations: preparations,categories: categories, value: '/admin/prescriptions'})
      })
    })
  })
  
})

router.post('/edit/:id',(req, res) => {
  Prescription.findById(req.params.id).then(editPrescription => {
    let errors = [];   
    if(!req.body.title){
        errors.push({message: 'please enter the prescription title'});
    }
    if(!req.body.description){
        errors.push({message: 'please enter description'})
    }
    if(!req.body.category){
      errors.push({message: 'please enter category'})
    }
    if(!isEmpty(req.files)){
      let extension = ['png','jpg','svg','ico','jpeg','gif'];
      let fn = req.files.image.name;
      let ext = fn.substring(fn.indexOf('.')+1);
      let img_ext = extension.includes(ext); 
      if(img_ext == false){
          errors.push({message: 'please enter validate image'});
      }
    }
    if(!req.body.name && !req.body.preparation){
      errors.push({message: 'please add at least one method'});
    }
    if(errors.length > 0){
      Preparation.find({prescription: editPrescription.id}).then(preparations=> {
        Category.find({}).then(categories=> {
          res.render('admin/prescriptions/edit',
          { errors: errors,
            prescription: editPrescription,
            categories: categories,
            preparations: preparations   
          });
        })
      })
        
    }else{
        let imagePrescription = editPrescription.image;

        if(req.files){
            let image = req.files.image;
            imagePrescription = Date.now()+'_'+image.name;

            image.mv('./public/uploads/bg-precreption/'+ imagePrescription,err=>{
                if(err) throw err;
            });
            fs.unlink(uploadDir +'uploads/bg-precreption/'+ editPrescription.image,(err)=>{

            });
        }

        editPrescription.title = req.body.title
        editPrescription.description = req.body.description
        editPrescription.category = req.body.category
        editPrescription.image = imagePrescription

        // Variable preparations be array object of prep 
        let preparations = [];

        editPrescription.save().then(prescriptionSaved=>{
          Preparation.find({prescription: prescriptionSaved.id}).then(preparationsRemoved => {
            preparationsRemoved.forEach(element => {
              element.remove()
            })
          })
            if(Array.isArray(req.body.name)){    
              for (let i = 0; i < req.body.name.length; i++) {
                preparations[i] = {
                  prescription: prescriptionSaved.id,
                  name: req.body.name[i],
                  howToPrepare: req.body.preparation[i],
                  ingredients: req.body.ingredients[i]
                }
              }
              preparations.forEach(element => {
                  const newPreparation = new Preparation({
                    prescription: prescriptionSaved.id,
                    name: element.name,
                    howToPrepare: element.howToPrepare,
                    ingredients: element.ingredients || ''
                  })
                  newPreparation.save();
              });
            }else {
                const newPreparation = new Preparation({
                  prescription: prescriptionSaved.id,
                  name: req.body.name,
                  howToPrepare: req.body.preparation,
                  ingredients: req.body.ingredients || ''
                })
                newPreparation.save();
            }
            
            req.flash('success_message',`Prescription is updated successfully`);
            res.redirect('/admin/prescriptions');
        }).catch(err=>{
            res.render('admin/prescriptions', {err:'error update'});
        });
        
    }
  })
})

router.post('/delete', (req,res) => {
  Prescription.findById(req.body.id).then(prescriptionRemoved => {
    fs.unlink(uploadDir+'uploads/bg-precreption/'+prescriptionRemoved.image,err=> {
    });
    Preparation.find({prescription: prescriptionRemoved.id}).then(preparationsRemoved => {
      preparationsRemoved.forEach(element => {
        element.remove()
      })
    })
    req.flash({'success_message':`Prescription ${prescriptionRemoved.id} is removed successfully`});
    prescriptionRemoved.remove();
    res.redirect('/admin/prescriptions');
    
}).catch(error=>{
    Prescription.find({}).populate('category').then(prescriptions => {
      res.render('admin/prescriptions/index',{prescriptions: prescriptions, value: '/admin/prescriptions', error:'somethings error for delete prescription'})
    })
});
})

module.exports = router;