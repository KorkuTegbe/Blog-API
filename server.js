const http = require('http')
require('./config/db.config').connectToMongoDB() 
require('dotenv').config()
// const app = require('./app')
const {app} = require('./index')

const PORT = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(PORT, console.log(`Server started on port ${PORT}`))
