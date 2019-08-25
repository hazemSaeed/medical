const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
});

router.get('/',(req, res) => {  
    Category.find({}).then(categories => {
        res.render('admin/categories/index',{categories: categories, value: '/admin/categories'})
    })
 
})

router.post('/add',(req,res)=> {
  let errors = [];  
  console.log(req.body.category);
  
  if (!req.body.category) {
    errors.push({message: 'please enter your category name'});
  }
  if (errors.length > 0) {
    res.render('admin/categories/index', {
      errors: errors
    })
  } else {
      const category_name = req.body.category
    Category.findOne({category: category_name}).then(category => {
        if(category){
            req.flash('error_message', 'That category exist, please try again');
            res.send({data: 'failed'})
        }
        const newCategory = new Category({
            category: category_name
        })
        newCategory.save().then(savedCategory => {
            console.log('saved category');
            
            req.flash('success_message', 'You are added succefully');
            console.log(savedCategory);
                      
            res.send(savedCategory)
        })
    })
  }
})

router.post('/edit', (req,res)=> {
  Category.findById(req.body.id).then(newCategory => { 
    newCategory.category = req.body.category;
    newCategory.save().then(savedCategory=>{
      res.send(savedCategory.category)
    })
  })
})

router.post('/delete', (req,res)=> {
  Category.findById(req.body.id).then(deleteCategory => { 
    deleteCategory.remove().then(removedCategory => {
      res.send({message: 'success removed',category: removedCategory.category})
    })
  })
})

module.exports = router