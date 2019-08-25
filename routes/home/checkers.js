const express = require('express')
const router = express.Router()
const unirest = require('unirest');
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home'
  next()
})

router.get('/', (request, response) => {
    response.render('home/checker/index')
})

router.post('/locations',(request,response)=>{
  const gender = request.body.gender
  const age = request.body.age
  
  const req = unirest("GET", "https://priaid-symptom-checker-v1.p.rapidapi.com/body/locations")
  req.query({"language":"en-gb"})
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});

  req.end( res => {
    if (res.error) 
    response.render('/',{error: res.error});

    const data =  {locations: res.body, gender: gender, age: age}
    response.render('home/checker/locations',data)
  })
})
router.get('/sublocations/:id',(request,response)=> {
  const id = request.params.id
  // GET All Locations
  const req = unirest("GET", "https://priaid-symptom-checker-v1.p.rapidapi.com/body/locations/"+id+ "")
  req.query({"language":"en-gb"})
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});

  req.end( res => {
    if (res.error) 
      response.send({error: res.error});

    const data = {sublocations: res.body}
    response.send(data)
  })
})

router.get('/symptoms/:id/:age/:gender',(request,response)=> {
  const id = request.params.id
  const age = request.params.age
  const gender = request.params.gender
  let gend = 'man'
  if(gender === 'female'){
    gend = 'woman'
  }
  
  // GET All Symptoms with ID_SYMPTOMS
  const req = unirest("GET", `https://priaid-symptom-checker-v1.p.rapidapi.com/symptoms/${id}/${gend}`)
  req.query({"language":"en-gb"})
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});

  req.end( res => {
    if (res.error) 
      response.send({error: res.error});
    
    const data = {symptoms: res.body,age:age,gender:gend}     
    response.render('home/checker/symptoms',data)
  })
})

router.post('/causes',(request,response)=> {
  const id_symptoms = request.body.symptom
  const age = request.body.age
  const gender = request.body.gender
  const year = new Date().getFullYear() - age;

  let gend = 'male'
  if(gender === 'woman'){
    gend = 'female'
  }
  const arr_ids = []
  for (let i = 0; i < id_symptoms.length; i++) {
    arr_ids.push(parseInt(id_symptoms[i], 10));
  }
  str_arr = arr_ids.toString(arr_ids);
// GET All Diagnosis
  const req = unirest("GET", "https://priaid-symptom-checker-v1.p.rapidapi.com/diagnosis")
  req.query({
    "symptoms": "["+str_arr+"]",
    "gender": gend,
    "year_of_birth": year,
    "language": "en-gb"
  });
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});

  req.end( res => {
    if (res.error) 
      response.send({error: res.error});

    response.render('home/checker/causes',res.body)
  })
})

router.get('/disease/:id',(request,response)=> {
  const id = request.params.id
  // GET All Locations
  const req = unirest("GET", `https://priaid-symptom-checker-v1.p.rapidapi.com/issues/${id}/info`)
  req.query({"language":"en-gb"})
  req.headers({"x-rapidapi-host": "priaid-symptom-checker-v1.p.rapidapi.com", "x-rapidapi-key": "16b68117e7msh4f718c1e8490e9ep1d3ae7jsnf754dd234d3b"});

  req.end( res => {
    if (res.error) 
      response.send({error: res.error});

    response.send(res.body)
  })
})

module.exports = router