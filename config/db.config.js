const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_MONGODB_URI = process.env.LOCAL_MONGODB_URI;
const MONGODB_ATLAS_URI=process.env.MONGODB_ATLAS_URI
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI
// connect to mongodb
function connectToMongoDB() {
    mongoose.connect(MONGODB_ATLAS_URI);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB successfully');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB', err);
    })
}

module.exports = { connectToMongoDB };