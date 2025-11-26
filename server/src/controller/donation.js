const Donations = require('../models/donation')
const PDFDocument = require('pdfkit');

const addNewDonation =  async(req, res) => {
    try {
      // Add recorded date when donation is created
      const donationData = {
        ...req.body,
        recordedDate: new Date()
      };
      const data = await Donations.create(donationData);
      if(data){
        res.json({
            msg: "Offering entry added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      res.status(500).json({
        msg: "Failed to add donation",
        error: error.message
      });
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
  
  const getDonations = async (req, res) => {
    try {
      let query = {};
      const { month, year } = req.query;
      
      // Filter by month and year if provided
      if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
        query.donationDate = {
          $gte: startDate,
          $lte: endDate
        };
      }
      
      const donations = await Donations.find(query).sort({ donationDate: -1 });
      
      res.json({ donations });
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getCurrentMonthDonations = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      const aggregationPipeline = [
        {
          $match: {
            donationDate: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }
        },
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
      console.error('Error fetching current month donations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getMonthlyDonations = async (req, res) => {
    try {
      const now = new Date();
      const months = [];
      
      // Get last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const aggregationPipeline = [
          {
            $match: {
              donationDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
              }
            }
          },
          {
            $group: {
              _id: null,
              totalDonation: { $sum: '$donationAmount' },
              count: { $sum: 1 }
            }
          }
        ];
        
        const result = await Donations.aggregate(aggregationPipeline);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        months.push({
          month: monthName,
          totalDonation: result[0]?.totalDonation || 0,
          count: result[0]?.count || 0
        });
      }
      
      res.json({ monthlyData: months });
    } catch (error) {
      console.error('Error fetching monthly donations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const  generateReport = async (req, res) => {
    try {
      let query = {};
      const { month, year } = req.query;
      
      // Filter by month and year if provided
      if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
        query.donationDate = {
          $gte: startDate,
          $lte: endDate
        };
      }
      
      const donations = await Donations.find(query).sort({ donationDate: 1 });
      const doc = new PDFDocument();
  
      // Setting PDF metadata (optional)
      doc.info.Title = 'Offerings Collection Report';

      // Adding content to the PDF (customize this part based on your report format)
      doc.fontSize(16).text('Offerings Collection Report', { align: 'center' });
      if (month && year) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        doc.fontSize(12).text(`Period: ${monthNames[parseInt(month) - 1]} ${year}`, { align: 'center' });
      }
      doc.fontSize(12).text('Generated on: ' + new Date().toLocaleString(), { align: 'right' });
      doc.moveDown(); // Move cursor down
      
      // Group donations by month
      const donationsByMonth = {};
      donations.forEach((donation) => {
        const donationDate = new Date(donation.donationDate);
        const monthKey = `${donationDate.getFullYear()}-${donationDate.getMonth()}`;
        if (!donationsByMonth[monthKey]) {
          donationsByMonth[monthKey] = {
            month: donationDate.getMonth(),
            year: donationDate.getFullYear(),
            donations: [],
            total: 0
          };
        }
        donationsByMonth[monthKey].donations.push(donation);
        donationsByMonth[monthKey].total += donation.donationAmount;
      });
      
      // Sort months chronologically
      const sortedMonths = Object.keys(donationsByMonth).sort();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      let grandTotal = 0;
      
      // Loop through each month
      sortedMonths.forEach((monthKey) => {
        const monthData = donationsByMonth[monthKey];
        const monthName = monthNames[monthData.month];
        
        // Month header
        doc.fontSize(14).text(`${monthName} ${monthData.year}`, { underline: true });
        doc.moveDown(0.5);
        
        // List donations for this month
        monthData.donations.forEach((donation) => {
          doc.fontSize(10).text(`Offering Date: ${donation.donationDate.toLocaleString()}`);
          doc.fontSize(10).text(`Entered By: ${donation.user}`);
          doc.fontSize(10).text(`Offering Type: ${donation.donationType || 'General Offering'}`);
          doc.fontSize(10).text(`Offering Amount: Rs ${donation.donationAmount}`);
          if (donation.remarks) {
            doc.fontSize(10).text(`Remarks: ${donation.remarks}`);
          }
          if (donation.verifiedBy) {
            doc.fontSize(10).text(`Verified By: ${donation.verifiedBy}`);
          }
          doc.fontSize(10).text(`Recorded Date: ${donation.recordedDate ? donation.recordedDate.toLocaleString() : donation.createdAt.toLocaleString()}`);
          doc.moveDown(0.5);
        });
        
        // Month total
        doc.fontSize(11).text(`Total for ${monthName} ${monthData.year}: Rs ${monthData.total}`, { align: 'right' });
        doc.moveDown();
        grandTotal += monthData.total;
      });
  
      doc.moveDown();
      doc.fontSize(12).text(`Grand Total Offerings Amount: Rs ${grandTotal}`, { align: 'right', underline: true });
  
      // Setting the response content type to PDF
      res.setHeader('Content-Type', 'application/pdf');
  
      // Piping the PDF document to the response stream
      doc.pipe(res);
  
      // Finalizing the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating PDF report: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

module.exports = {addNewDonation, getTotalDonationAmount, getDonations, getCurrentMonthDonations, getMonthlyDonations, generateReport}
