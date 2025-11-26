const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    type: {
        type: String,
        enum: ['service', 'event'],
        required: true,
        default: 'service',
      },
    eventTitle: {
        type: String,
        required: true,
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
    // Service Schedule Roles (for type: 'service')
    serviceCoordinator: {
        type: String,
        trim: true,
      },
    choirLead: {
        type: String,
        trim: true,
      },
    specialPrayers: {
        type: String,
        trim: true,
      },
    sermonSpeaker: {
        type: String,
        trim: true,
      },
    offeringsCollectionTeam: {
        type: String,
        trim: true,
      },
    offeringsCountingTeam: {
        type: String,
        trim: true,
      },
    // Event fields (for type: 'event')
    eventDescription: {
        type: String,
        trim: true,
      },
    location: {
        type: String,
        trim: true,
      },
    },
    {
        timestamps: true, // Add timestamps to the schema
    }
    );
    
   const Events = mongoose.model('Event', eventSchema);

   module.exports = Events;
   