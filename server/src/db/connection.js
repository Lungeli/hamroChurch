const mongoose = require('mongoose');

const dbConfig = require('../config/dbConfig.json')

const connection = async() => {
    try{
        // Set connection options to prevent buffering timeout
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        
        const res = await mongoose.connect(`${dbConfig.MONGODB_CONNECTION_URI}/${dbConfig.MONGODB_DATABASE_NAME}`, options);
        if(res) {
            console.log("Connected to RTN FG Church mongodb")
        }
    }catch(err){
        console.error('Database connection error:', err.message)
        throw err; // Re-throw to allow caller to handle
    }
}
    
module.exports = connection
