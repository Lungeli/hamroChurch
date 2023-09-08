const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    eventTitle: {
        type: String,
        required: true,
        trim: true,
      },
      eventDescription: {
        type: String,
        trim: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      location: {
        type: String,
        trim: true,
      },
      assignedTo: {
        type: String,
      },

    },
    {
        timestamps: true, // Add timestamps to the schema
    }
    );
    
   const Events = mongoose.model('Event', eventSchema);

   module.exports = Events;
   