import React, { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY/MM/DD';  
import Header from '../../components/Header';
import { Formik, Form, Field } from 'formik';



const Donation = () => {
    const [donationDate, setDonationDate] = useState(0);
    
    const handleAddDonation = async(values) => {
        console.log(values)
    }

    const addDate = async(values) =>{

    }

    return(
      <>
        <Header/>
        <div>
            <h1>Add Donation</h1></div>
   
    <Formik
         initialValues={{
            totalDonation: '',
            donationDate:''
         }}
         onSubmit={values => {
          handleAddDonation(values)
         }}
       >
         {({ errors, touched }) => (
           <Form>
            <h2>Select the Date: </h2>
                 <Space direction="vertical" size={12}>
    <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={dateFormat} onPanelChange={addDate} />
    
    </Space>
            <h2>Total Donation in Rs:</h2>
             <Field name="totalDonation" placeholder="Total Donation"/>
             <button type="submit">Add Data </button>
           </Form>
         )}
       </Formik>

   
       
          </>
    
    )
  }

export default Donation;