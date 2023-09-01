const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
    donationAmount: Number,
    donationDate: Date,
    user: String
   },
   {
    timestamps: true // adding timestamp
});
    
   const Donations = mongoose.model('Donation', donationSchema);

   module.exports = Donations;
   