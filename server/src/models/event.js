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
      organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
      },
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'member',
        },
      ],
    });
    
   const Events = mongoose.model('Event', eventSchema);

   module.exports = Events;
   