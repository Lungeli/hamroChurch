const Members = require('../models/member')

const addNewMember = async (req, res) => {
  try {
    // Check if user already exists based on phone number
    const phoneNumberData = await Members.findOne({ phoneNumber: req.body.phoneNumber });
    
    // Check if user already exists based on full name
    const data = await Members.findOne({ fullName: req.body.fullName });
    

    if (phoneNumberData) {
      res.status(409).json({
        msg: "Phone Number already exists",
        success: false
      });
    }
    else if (data) {
      res.status(409).json({
        msg: "User already exists",
        success: false
      });
    } 
      else {
      const data = await Members.create(req.body);
      if (data) {
        res.json({
          msg: "Member added successfully",
          success: true
        });
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
const getAllMembers = async (req, res) => {
  const data = await Members.find().limit(req.query.size).skip((req.query.page - 1)* req.query.size )
  const count = await Members.find().count()
  if(data){
      res.json({
          memberList: data,
          count:count
      })
  }
      
  }


const countMale = async(req, res) => {
    try {
        const maleCount = await Members.countDocuments({ gender: 'Male' });
        res.json({ maleCount });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
}
const countFemale = async(req, res) => {
    try {
        const femaleCount = await Members.countDocuments({ gender: 'Female' });
        res.json({ femaleCount });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
}



module.exports = {addNewMember, getAllMembers, countMale, countFemale}
