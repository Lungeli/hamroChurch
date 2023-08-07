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
  
const getAllProducts = async(req,res)=>{
    const data =  await Products.find()
    if(data){
     res.json({
       data,
       msg: 'success'
     })
    }  
 
   }


module.exports = {addNewMember, getAllProducts}
