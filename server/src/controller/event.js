const Events = require('../models/event')

// const testEvent =  async(req, res) => {
//     res.json({ message: 'API is working' });
// }

const addNewEvent =  async(req, res) => {
    const data = await Events.create(req.body)
    if(data){
      res.json({
          msg: "Event added successfully",
      }
      )
 }
}

const getEvent = async(req, res) => {
    try {
        const data = await Events.find();
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }

}



module.exports = {addNewEvent, getEvent}