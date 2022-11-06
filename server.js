const http = require('http')
require('./config/db.config').connectToMongoDB() 
require('dotenv').config()
// const app = require('./app')
const {app} = require('./index')

// const PORT = process.env.PORT || 3000;

const server = http.createServer(app)

// require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_ATLAS_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_ATLAS_URI


server.listen(PORT, console.log(`Server started on port ${PORT}`))

module.exports = {
  MONGODB_ATLAS_URI,
  PORT
}