const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()
const exphbs = require('express-handlebars')
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose')
const {mongoDbUrl} = require('./config/database')
const passport = require('passport')
const methodOverride = require('method-override')
const upload = require('express-fileupload')
const {generateDate, check, select, active, math, getData, state, paginate, rated} = require('./helpers/handlebars')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise
// Connection Mongoose
mongoose.connect(mongoDbUrl,{useNewUrlParser:true}).then(db=>{
  console.log('connected');
}).catch(err=>console.log(err));

// use Public
app.use(express.static(path.join(__dirname, 'public')))

//  Method Override
app.use(methodOverride('_method'))

// Use Upload Middleware
app.use(upload())

// use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Use Flash
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); // session middleware
app.use(flash());

// Passport MiddleWare
app.use(passport.initialize())
app.use(passport.session({secret: 'medical care authentication', cookie:{maxAge: 60000}, resave: false, saveUninitialized: false}))

// Set Engine To Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'home',
  helpers:
    {
      active: active, 
      getData: getData,
      generateDate: generateDate, 
      select: select, 
      math: math,
      check: check,
      state: state,
      paginate: paginate,
      rated: rated
    }}))
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  next();
});
app.use((req,res,next)=> {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Load Router Home
const home = require('./routes/home/index')
const doctors = require('./routes/home/doctors')
const prescriptions = require('./routes/home/prescriptions')
const checkers = require('./routes/home/checkers')

// Load Router Admin
const admin = require('./routes/admin/index')
const admin_doctor = require('./routes/admin/doctor')
const admin_user = require('./routes/admin/user')
const admin_prescription = require('./routes/admin/prescription')
const admin_preparation = require('./routes/admin/preparation')
const admin_category = require('./routes/admin/category')

// Use Router Home
app.use('/', home)
app.use('/doctors', doctors)
app.use('/prescriptions', prescriptions)
app.use('/checkers', checkers)

// Use Router Admin
app.use('/admin', admin)
app.use('/admin/doctors', admin_doctor)
app.use('/admin/users', admin_user)
app.use('/admin/prescriptions', admin_prescription)
app.use('/admin/preparation', admin_preparation)
app.use('/admin/categories', admin_category)


// 404
app.use(function(req, res, next) {
  return res.status(404).redirect('/404')
})

// 500 - Any server error
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
})

module.exports = app
