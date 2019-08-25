const express = require('express')
const router = express.Router()
const Prescription = require('../../models/Prescription')
const Preparation = require('../../models/Preparation')
const Category = require('../../models/Category')
const Rating = require('../../models/Rating')
const async = require("async")
router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'home'
    next()
})

router.get('/', (req,res) => {
    const perPage = 8
    const page = req.query.page || 1
    Prescription.find({})
    .skip((page * perPage) - perPage)
    .limit(perPage)
    .sort({published: -1})
    .populate('category')
    .then(prescriptions => {
        Prescription.countDocuments().then(prescriptionCount => {
                res.render('home/prescriptions/index',
                {
                    prescriptions: prescriptions, 
                    current: parseInt(page),
                    pages: Math.ceil(prescriptionCount/perPage)
                })         
        })      
      })
    .catch(err=> {
        res.redirect('/')
      })  
})

router.post('/get', (req, res)=> {
    Prescription.find({}).select(['title','category']).populate('category').then(prescriptions=> {
        res.send({prescriptions: prescriptions})
    })
})

router.get('/view/:id', (req,res) => {
    const id = req.params.id
    Prescription.findById(id).populate('category').then(prescription=> {   
        Preparation.find({prescription: prescription.id}).then(preparations=> {
            if(req.user){
                Rating.find({user: req.user.id}).then(rating_user => {
                    res.render('home/prescriptions/view',{rating_user: rating_user || [],prescription: prescription, preparations: preparations})
                })
            }
            else {
                res.render('home/prescriptions/view',{prescription: prescription, preparations: preparations})
            }
           
        }).catch(err=>{
            res.redirect('/prescriptions')
        })
    }).catch(err=>{
        res.redirect('/prescriptions')
    })   
})

router.get('/search',(req,res)=>{
    let byCategories = [], byTitle
    let title = req.query.q;
    let reg = new RegExp('.*'+title+'.*','i');
    async.series([
        function(callback){
            Category.find({category: reg}).then(categories => {
                categories.forEach(category => {
                    Prescription.find({category: category.id}).populate('category').then(prescriptions => {
                        byCategories = [...prescriptions, ...byCategories]
                        callback(null,byCategories)
                    })
                })
                callback(null, byCategories)
            }).catch(err => {
                byCategories = []
                callback(null, byCategories)
            })
        },
        function(callback){
            Prescription.find({title:reg}).populate('category').sort({date:'desc'}).then(prescriptions => {
                byTitle = prescriptions
                callback(null,byTitle)
            }).catch(err => {
                byTitle = []
                callback(null, byTitle)
            })
        }
    ], function(err){   
        res.render('home/prescriptions/search',
        {
        prescriptions: merge_array(byCategories, byTitle)
        })       
      })
});

function merge_array(array1, array2) {
    const result_array = [];
    const arr = array1.concat(array2);
    let len = arr.length;
    const assoc = {};

    while(len--) {
        const item = arr[len];

        if(!assoc[item]) 
        { 
            result_array.unshift(item);
            assoc[item] = true;
        }
    }

    return result_array;
}

module.exports = router