import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation'
import { Button, message, Result, Radio, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Head from "next/head";



const Register = () => {
  const router = useRouter()

  const [messageApi, contextHolder] = message.useMessage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const goToDashboard=()=>{
    router.push('/dashboard')
  }
  const addmembersAgain=()=>{
    window.location.reload();
  }


    const memberSchema = Yup.object().shape({
        fullName: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),
        gender: Yup.string()
          .required('Required'),
        email: Yup.string().email('Invalid email'),
        phoneNumber: Yup.string()
        .required('Phone Number Required'),

      });
      
    const handleAddMember = async(values) => {
        console.log(values)
        const {confirmPassword, ...formFields }= values
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formFields)
      };
      const res = await fetch('http://localhost:4000/member',requestOptions)
      const data = await res.json()
      if(data) { 
        setShowSuccess(true);
        setSuccessMsg(data.msg)
      }else{
        messageApi.info(res.statusText);
      }
      }
    return(
      <>
      {contextHolder}
      {showSuccess ? (
     <Result
     status="success"
     title={successMsg}
     extra={[
       <Button type="primary" key="console" onClick={goToDashboard}>
         Go To Dashboard
       </Button>,
       <Button key="buy" onClick={addmembersAgain}>Add New Member</Button>,
     ]}
   />
      ) : (
        <React.Fragment>
            <Header/>
        <div className="container">
        <div className="app--login">
        <h2>Add a Member</h2>
        <Formik
         initialValues={{
            fullName: '',
            address: '',
            email: '',
            phoneNumber: '',
            image:'',
            gender: '',
            dob: '',
            maritalStatus: ''
         }}
         validationSchema={memberSchema}
         onSubmit={values => {
          handleAddMember(values)
         }}
       >
         {({ values, errors, touched, setFieldValue }) => (
           <Form>
             <Field name="fullName" placeholder="Full Name"/>
             {errors.fullName && touched.fullName ? (
               <div>{errors.fullName}</div>
             ) : null}
             <Field name="email" type="email" placeholder="Email"/>
             {errors.email && touched.email ? <div>{errors.email}</div> : null}
             <Field name="phoneNumber" type="text"  placeholder="Phone Number"/>
             {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
         
             <Field name="address" type="text" placeholder="Address"/>
             
             <Field name="dob" type="text" placeholder="Date of Birth (String Format)"/>
             <Field name="image" type="text" placeholder="Image Link"/>
             <Dropdown
        overlay={
          <Menu onClick={(e) => setFieldValue('maritalStatus', e.key)}>
            <Menu.Item key="Single">Single</Menu.Item>
            <Menu.Item key="Married">Married</Menu.Item>
          </Menu>
        }
        placement="bottomLeft"
      >
        <Button>
          {values.maritalStatus || 'Select Marital Status'} <DownOutlined />
        </Button>
      </Dropdown>
             
                <br/>
                <br/>
                Gender:
             <Radio.Group
            name="gender"
             value={values.gender}
              onChange={(e) => setFieldValue('gender', e.target.value)}
      >
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
                
      <br/>
             <button type="submit">Add </button>
           </Form>
         )}
       </Formik>
      </div>
      </div>
      <Footer/>
      <div>
        </div>
        </React.Fragment>
      )}
    </>
  );
};

export default Register;