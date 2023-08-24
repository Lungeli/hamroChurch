const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
    amount: Number,
    date: Date,
    user: String
   });
    
   const Donations = mongoose.model('Donation', donationSchema);

   module.exports = Donations;
   