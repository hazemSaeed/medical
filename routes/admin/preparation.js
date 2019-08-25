const express = require('express');
const router = express.Router();
const Preparation = require('../../models/Preparation')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next()
})

router.post('/delete/:id', (req,res) => { 
  Preparation.findById(req.body.id).then(preparationRemoved => {     
    req.flash({'success_message':`Preparation ${preparationRemoved.id} is removed successfully`})  
    res.send({'success_message':`Preparation ${preparationRemoved.id} is removed successfully`})
    preparationRemoved.remove()     
  }).catch(error=>{
        res.send({error:'somethings error for delete preparation'})
  })
})

module.exports = router