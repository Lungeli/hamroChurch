import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Login = () => {
  const router = useRouter();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (values) => {
    setIsSubmitting(true);
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      };
      const res = await fetch('http://localhost:4000/login', requestOptions);
      const data = await res.json();
      
      if (data && data.success && res.status === 200) {
        dispatch(setUserDetails(data));
        msg.success(data.msg || 'Login successful!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        msg.error(data.msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      msg.error('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .min(10, 'Phone number must be at least 10 digits'),
    password: Yup.string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters')
  });

  return (
    <>
      {contextHolder}
      <Header />
      <div className="container" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <div className="form-container">
          <div className="text-center mb-4">
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Sign in to your account to continue
            </p>
          </div>

          <Formik
            initialValues={{
              phoneNumber: '',
              password: ''
            }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
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
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
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
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center mt-4">
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Sign up
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

export default Login;
