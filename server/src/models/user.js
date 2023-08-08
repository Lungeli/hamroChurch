const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: String, // String is shorthand for {type: String}
    address: String,
    password: String,
    email: String,
    phoneNumber: Number,
    image: String,
    dob: String, 
    role: String,
    gender: String,
    mode: {type: String, default:'User'}
   });
    
   const Users = mongoose.model('User', userSchema);

   module.exports = Users;
   