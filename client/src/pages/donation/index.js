import React, { useState } from 'react';

import { DatePicker, Space } from 'antd';
const dateFormat = 'YYYY/MM/DD';  
import Header from '../../components/Header';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';



const Donation = () => {
    const [donationDate, setDonationDate] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const {userDetails} = useSelector(state=>state.users)
    const donationSchema = Yup.object().shape({

      
      // donationDate: Yup.date()
      //     .required('Please select the date'),
      donationAmount: Yup.number()
        .required('Please enter donation amount'),
      });
    
    const onChange = (date) => {
      setDonationDate(date);

    };
    const handleAddDonation = async(values) => {
      console.log(values)
      const {formFields }= values
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
    };
    const res = await fetch('http://localhost:4000/donation',requestOptions)
    const data = await res.json()
    if(data) { 
        messageApi.info(data.msg)
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
               <div>{errors.donationDate}</div>
             ) : null}
            <h2>Total Donation in Rs:</h2>
             <Field name="donationAmount" placeholder="Total Donation"/>
             {errors.donationAmount && touched.donationAmount ? (
               <div>{errors.donationAmount}</div>
             ) : null}
             <button type="submit">Add Data </button>
           </Form>
         )}
       </Formik>

   
       
          </>
    
    )
  }

export default Donation;