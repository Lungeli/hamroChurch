const Donations = require('../models/donation')
const PDFDocument = require('pdfkit');

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
  
  const  generateReport = async (req, res) => {
    try {
      const donations = await Donations.find({});
      const doc = new PDFDocument();
  
      // Setting PDF metadata (optional)
      doc.info.Title = 'Donation Report';
  
      // Adding content to the PDF (customize this part based on your report format)
      doc.fontSize(16).text('Donation Report', { align: 'center' });
      doc.fontSize(12).text('Generated on: ' + new Date().toLocaleString(), { align: 'right' });
      doc.moveDown(); // Move cursor down
      let totalDonation = 0;
      // Loop through donations and add them to the report
      donations.forEach((donation, index) => {
        doc.fontSize(10).text(`Donation Date: ${donation.donationDate.toLocaleString()}`);
        doc.fontSize(10).text(`User: ${donation.user}`);
        doc.fontSize(10).text(`Donation Amount: Rs ${donation.donationAmount}`);
        doc.fontSize(10).text(`Created At: ${donation.createdAt.toLocaleString()}`); // Include createdAt date
        doc.moveDown();
        // Adding the donation amount to the total
      totalDonation += donation.donationAmount;
      });
  
      doc.moveDown();
      doc.fontSize(12).text(`Total Donation Amount: Rs ${totalDonation}`, { align: 'right' });
  
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
  

module.exports = {addNewDonation, getTotalDonationAmount, generateReport}
