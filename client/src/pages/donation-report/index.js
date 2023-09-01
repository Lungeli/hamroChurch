import React, { useState, useEffect } from 'react';


const DonationReport = () => {
    const [pdfSrc, setPdfSrc] = useState(null);
    const fetchPdfReport = async()=> {
        try {
            const response = await fetch('http://localhost:4000/generate-donation-report'); 
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfSrc(url);
          } catch (error) {
            console.error('Error fetching PDF report:', error);
          }
    }
  
    useEffect(() => {
        fetchPdfReport();
      }, []);
  
      return (
        <div>
          <h1>Donation Report</h1>
          {pdfSrc ? (
            <embed src={pdfSrc} type="application/pdf" width="100%" height="600px" />
          ) : (
            <p>Loading PDF report...</p>
          )}
        </div>
      );
    };
  
  export default DonationReport;