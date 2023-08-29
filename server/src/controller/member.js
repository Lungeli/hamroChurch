const Members = require('../models/member')

const addNewMember=  async(req, res) => {
    const data = await Members.create(req.body)
    if(data){
      res.json({
          msg: "Member added successfully",
      }
      )
 }

}
  
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
