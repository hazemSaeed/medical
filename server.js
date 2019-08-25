const app = require('./app')
const http = require('http')

const port = 8000 || process.env.PORT

const server = http.createServer(app)
server.listen(port, () => {  
  console.log(`listening on port ${port}`)
})