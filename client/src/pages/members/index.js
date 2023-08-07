import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation'
import { Button, message } from 'antd';
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';


const Members = () => {
 

  const [messageApi, contextHolder] = message.useMessage();

    // const addMemberSchema = Yup.object().shape({
    //   fullName: Yup.string()
    //       .min(2, 'Too Short!')
    //       .max(50, 'Too Long!')
    //       .required('Required'),
    //     password: Yup.string()
    //     .min(5, 'Password Too Short!')
    //     .required('Required'),
    //     confirmPassword: Yup.string()
    //     .min(5, 'Password Too Short!')
    //     .required('Required')
    //     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    //     email: Yup.string().email('Invalid email'),
    //   });

      
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
          messageApi.info(data.msg)
      }else{
        messageApi.info(res.statusText);
      }
      }
    return(
        <>
        {contextHolder}
        <Header/>
      <div className='container'> 
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
        //  validationSchema={addMemberSchema}
         onSubmit={values => {
          handleAddMember(values)
         }}
       >
         {({ errors, touched }) => (
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
             <Field name="gender" type="text" placeholder="Gender"/>
             <Field name="dob" type="text" placeholder="Date of Birth (String Format)"/>
             <Field name="image" type="text" placeholder="Image Link"/>
             <Field name="maritalStatus" type="text" placeholder="Marital Status (Single/Married"/>
             <button type="submit">Add </button>
           </Form>
         )}
       </Formik>
      </div>
      </div>
      <Footer/>
      <div>
      

      </div>
      </>
    )
  }


export default Members