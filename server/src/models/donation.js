const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
    donationAmount: Number,
    donationDate: String,
    user: String
   });
    
   const Donations = mongoose.model('Donation', donationSchema);

   module.exports = Donations;
   