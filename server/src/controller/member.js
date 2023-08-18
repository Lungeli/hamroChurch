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


module.exports = {addNewMember, getAllMembers}
