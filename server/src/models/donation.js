const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
    donationAmount: Number,
    donationDate: Date,
    donationType: {
        type: String,
        enum: ['Tithe', 'General Offering', 'Special Offering'],
        default: 'General Offering'
    },
    remarks: String,
    user: String,
    recordedDate: {
        type: Date,
        default: Date.now
    }
   },
   {
    timestamps: true // adding timestamp
});
    
   const Donations = mongoose.model('Donation', donationSchema);

   module.exports = Donations;
   