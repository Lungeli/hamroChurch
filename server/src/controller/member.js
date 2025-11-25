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

const findMemberById = async (req, res) => {
  try {
    const memberId = req.params.id; 
    const member = await Members.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error finding member by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGenderPercentage = async (req, res) => {
  try {
    const totalCount = await Members.countDocuments();
    const maleCount = await Members.countDocuments({ gender: 'Male' });
    const femaleCount = await Members.countDocuments({ gender: 'Female' });
    
    const malePercentage = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
    const femalePercentage = totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0;
    
    res.json({
      malePercentage,
      femalePercentage,
      maleCount,
      femaleCount,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching gender percentage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAgePercentage = async (req, res) => {
  try {
    const members = await Members.find({ dob: { $exists: true, $ne: null } });
    
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '70+': 0
    };
    
    const currentDate = new Date();
    
    members.forEach(member => {
      if (member.dob) {
        try {
          // Parse DOB (format: YYYY.MM.DD or YYYY-MM-DD)
          const dobParts = member.dob.split(/[.-]/);
          if (dobParts.length >= 3) {
            const year = parseInt(dobParts[0]);
            const month = parseInt(dobParts[1]) - 1; // Month is 0-indexed
            const day = parseInt(dobParts[2]);
            
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
              const birthDate = new Date(year, month, day);
              const age = currentDate.getFullYear() - birthDate.getFullYear();
              const monthDiff = currentDate.getMonth() - birthDate.getMonth();
              const dayDiff = currentDate.getDate() - birthDate.getDate();
              
              const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
              
              if (actualAge <= 18) {
                ageGroups['0-18']++;
              } else if (actualAge <= 30) {
                ageGroups['19-30']++;
              } else if (actualAge <= 50) {
                ageGroups['31-50']++;
              } else if (actualAge <= 70) {
                ageGroups['51-70']++;
              } else {
                ageGroups['70+']++;
              }
            }
          }
        } catch (err) {
          console.error('Error parsing DOB for member:', member._id, err);
        }
      }
    });
    
    const totalWithAge = Object.values(ageGroups).reduce((sum, count) => sum + count, 0);
    
    const agePercentages = {};
    Object.keys(ageGroups).forEach(group => {
      agePercentages[group] = totalWithAge > 0 
        ? Math.round((ageGroups[group] / totalWithAge) * 100) 
        : 0;
    });
    
    res.json({
      ageGroups,
      agePercentages,
      totalWithAge
    });
  } catch (error) {
    console.error('Error fetching age percentage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {addNewMember, getAllMembers, countMale, countFemale, findMemberById, getGenderPercentage, getAgePercentage}
