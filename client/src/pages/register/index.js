import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'


const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
  .min(2, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required'),
password: Yup.string()
.min(5, 'Password Too Short!')
.required('Required'),
confirmpassword: Yup.string()
.min(5, 'Password Too Short!')
.required('Required')
.oneOf([Yup.ref('password'), null], 'Passwords must match'),
email: Yup.string().email('Invalid email').required('Required'),
});

const handleResgister = async (values) => {
  const {confirmpassword, ...formFields} = values
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formFields)
};
fetch('http://localhost:4000/register', requestOptions)
}

export const Register = () => (
  <div className='Register'>
    <h1>Signup</h1>
    <Formik
      initialValues={{
        fullName: '',
        phoneNumber: '',
        email: '',
        password: ''
      }}
      validationSchema={SignupSchema}
      onSubmit={values => {
        handleResgister(values)
        // console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          Full Name: <Field name="fullName" placeholder="Full Name"/>
          {errors.fullName && touched.fullName ? (
            <div>{errors.fullName}</div>
          ) : null} <br/>
          PHone Number:<Field name="phoneNumber" placeholder="Phone Number"/>
          {errors.phoneNumber && touched.phoneNumber ? (
            <div>{errors.phoneNumber}</div>
          ) : null} <br/>
         Email:  <Field name="email" type="email" placeholder="Email"/>
          {errors.email && touched.email ? <div>{errors.email}</div> : null} <br/>
          Password:  <Field name="password" type="password" placeholder="Password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null} <br/>
          Confirm Password: <Field name="confirmpassword" type="password" placeholder="Confirm Password"/>
             {errors.confirmpassword && touched.confirmpassword ? <div>{errors.confirmpassword}</div> : null} <br/>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>

    Already have an account?  <Link href="/login">Login</Link> instead
  </div>
);

export default Register