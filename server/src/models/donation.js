const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
    totalDonation: Number,
    donationDate: String,
    user: String
   });
    
   const Donations = mongoose.model('Donation', donationSchema);

   module.exports = Donations;
   