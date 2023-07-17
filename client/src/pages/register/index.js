import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
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

export const Register = () => (
  <div className='Register'>
    <h1>Signup</h1>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
      }}
      validationSchema={SignupSchema}
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

    Already have an account? Login instead
  </div>
);

export default Register