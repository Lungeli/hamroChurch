import React, { useState } from 'react';

import { DatePicker, Space } from 'antd';
const dateFormat = 'YYYY/MM/DD';  
import Header from '../../components/Header';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';

const addEvent = () => {
    const [donationDate, setDonationDate] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {userDetails} = useSelector(state=>state.users)
    const donationSchema = Yup.object().shape({

      // donationDate: Yup.date()
      // .required('Please select the date')
      donationAmount: Yup.number()
        .required('Please enter donation amount'),
      });
    
      const onChange = (date) => {
        // Format the date in ISO format before setting it in the state
        const isoFormattedDate = date ? date.toISOString() : null;
        setDonationDate(isoFormattedDate);
      };
    const handleAddDonation = async(values) => {
     // Converting the donationDate to ISO format before sending it to the server
     const formData = {
            ...values,
             donationDate: donationDate, // Assuming donationDate is already in ISO format
     };
      console.log(formData)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    };
    const res = await fetch('http://localhost:4000/donation',requestOptions)
    const data = await res.json()
    if(data) { 
        messageApi.info(data.msg)
        window.location.reload();
    }else{
      messageApi.info(res.statusText);
    }
    }

    return(
      <>
        {contextHolder}
        
    <Header/>
    
        <div>
            <h1>Add Donation</h1></div>
   
    <Formik
         initialValues={{
          donationAmount: '',
            donationDate:'',
            user: userDetails.fullName,
         }}
         validationSchema={donationSchema}
         onSubmit={values => {
    
         const formData = {
          ...values,
          donationDate,
        };
  
        handleAddDonation(formData);
          
         }}
       >
         {({ errors, touched }) => (
           <Form>
            <h2>Select the Date: </h2>

             <DatePicker format="YYYY-MM-DD" onChange={onChange} />  
             {errors.donationDate && touched.donationDate ? (
              <div style={{ color: 'red' }}>{errors.donationDate}</div>
              ) : null}

            <h2>Total Donation in Rs:</h2>
             <Field name="donationAmount" placeholder="Total Donation"/>
             {errors.donationAmount && touched.donationAmount ? (
              <div style={{ color: 'red' }}>{errors.donationAmount}</div>
              ) : null}

             <button type="submit">Add Data </button>
           </Form>
         )}
       </Formik>

   
       
          </>
    
    )
  }

export default addEvent;