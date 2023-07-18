import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'

const loginSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Required'),
  Number: Yup.number()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const Login = () => (
  <div className='Login'>
    <h1>Login</h1>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
      }}
      validationSchema={loginSchema}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          First Name: <Field name="FullName" />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null} <br/>
          Number:<Field name="number" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null} <br/>
         Email:  <Field name="email" type="email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null} <br/>
          Password:  <Field name="password" type="password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null} <br/>
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>

    Don't have an account?   <Link href="/register">Register </Link>instead
  </div>
);

export default Login