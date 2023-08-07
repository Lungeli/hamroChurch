const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
    fullName: String, // String is shorthand for {type: String}
    address: String,
    email: String,
    phoneNumber: Number,
    image: String,
    dob: String, 
    gender: String,
    maritalStatus: String
   });
    
   const Members = mongoose.model('Member', memberSchema);

   module.exports = Members;
   