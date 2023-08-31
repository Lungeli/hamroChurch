const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new mongoose.Schema({
    fullName: String,
    address: String,
    email: String,
    phoneNumber: Number,
    image: String,
    dob: String,
    gender: String,
    maritalStatus: String
}, {
    timestamps: true // adding timestamp
});
    
   const Members = mongoose.model('Member', memberSchema);

   module.exports = Members;
   