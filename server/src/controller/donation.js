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

const getTotalDonationAmount = async (req, res) => {
    try {
      const aggregationPipeline = [
        {
          $group: {
            _id: null,
            totalDonation: { $sum: '$donationAmount' },
          },
        },
      ];
  
      const result = await Donations.aggregate(aggregationPipeline);
      const totalDonation = result[0]?.totalDonation || 0;
  
      res.json({ totalDonation });
    } catch (error) {
      console.error('Error fetching total donation amount:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
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


module.exports = {addNewDonation, getTotalDonationAmount}
