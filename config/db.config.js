const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_MONGODB_URI = process.env.LOCAL_MONGODB_URI;

// connect to mongodb
function connectToMongoDB() {
    mongoose.connect(LOCAL_MONGODB_URI);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB', err);
    })
}

module.exports = { connectToMongoDB };