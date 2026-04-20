const mongoose = require('mongoose');

const connection = async() => {
    try{
        const mongoUri = process.env.MONGODB_CONNECTION_URI;
        const mongoDbName = process.env.MONGODB_DATABASE_NAME;

        if (!mongoUri || !mongoDbName) {
            throw new Error('Missing required env vars: MONGODB_CONNECTION_URI and/or MONGODB_DATABASE_NAME');
        }

        // Set connection options to prevent buffering timeout
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        
        const res = await mongoose.connect(`${mongoUri}/${mongoDbName}`, options);
        if(res) {
            console.log("Connected to RTN FG Church mongodb")
        }
    }catch(err){
        console.error('Database connection error:', err.message)
        throw err; // Re-throw to allow caller to handle
    }
}
    
module.exports = connection
