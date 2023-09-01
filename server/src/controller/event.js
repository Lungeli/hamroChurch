const Events = require('../models/event')

const testEvent =  async(req, res) => {
    res.json({ message: 'API is working' });

}

module.exports = {testEvent}