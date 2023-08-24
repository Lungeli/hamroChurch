const Donations = require('../models/donation')

const addNewDonation =  async(req, res) => {
    const data = await Donations.create(req.body)
    if(data){
      res.json({
          msg: "Donation entry added successfully",
      }
      )
 }

}
  
// const getAllMembers = async (req, res) => {
//   const data = await Members.find().limit(req.query.size).skip((req.query.page - 1)* req.query.size )
//   const count = await Members.find().count()
//   if(data){
//       res.json({
//           memberList: data,
//           count:count
//       })
//   }
      
//   }


module.exports = {addNewDonation}
