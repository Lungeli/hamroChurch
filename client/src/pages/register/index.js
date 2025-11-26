import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { message } from 'antd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Name is too short!')
      .max(50, 'Name is too long!')
      .required('Full name is required'),
    password: Yup.string()
      .min(5, 'Password is too short!')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .min(5, 'Password is too short!')
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .min(10, 'Phone number must be at least 10 digits'),
  });

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...formFields } = values;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      };
      const res = await fetch('http://localhost:4000/register', requestOptions);
      const data = await res.json();
      
      if (data && res.status === 200) {
        dispatch(setUserDetails(data));
        messageApi.success(data.msg || 'Registration successful!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        messageApi.error(data.msg || 'Registration failed. Please try again.');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Header />
      <div className="container" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <div className="form-container">
          <div className="text-center mb-4">
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sign up to get started with RTN FG Church
            </p>
          </div>

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={SignupSchema}
            onSubmit={handleRegister}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <InputField
                  id="fullName"
                  name="fullName"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fullName && errors.fullName}
                  required
                />

                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  required
                />

                <InputField
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={values.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phoneNumber && errors.phoneNumber}
                  required
                />

                <InputField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  showPasswordToggle
                  required
                />

                <InputField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && errors.confirmPassword}
                  showPasswordToggle
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                  className="mt-3"
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>

                <div className="text-center mt-4">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
