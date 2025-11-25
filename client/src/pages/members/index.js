import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { message, Radio, Select, Result, Card } from 'antd';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

const { Option } = Select;

const AddMember = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Name is too short!')
      .max(50, 'Name is too long!')
      .required('Full name is required'),
    gender: Yup.string()
      .required('Gender is required'),
    email: Yup.string()
      .email('Invalid email address'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .min(10, 'Phone number must be at least 10 digits'),
    maritalStatus: Yup.string()
      .required('Marital status is required'),
    address: Yup.string()
      .required('Address is required'),
    dob: Yup.string()
      .required('Date of birth is required'),
  });

  const handleAddMember = async (values) => {
    setIsSubmitting(true);
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      };
      const res = await fetch('http://localhost:4000/member', requestOptions);
      const data = await res.json();
      
      if (data.success === true) {
        setShowSuccess(true);
        setSuccessMsg(data.msg);
      } else {
        messageApi.error(data.msg || 'Failed to add member');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Error adding member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const addMemberAgain = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  if (showSuccess) {
    return (
      <>
        <Header />
        <div className="container" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
          <Result
            status="success"
            title={successMsg}
            extra={[
              <Button key="dashboard" variant="primary" onClick={goToDashboard}>
                Go To Dashboard
              </Button>,
              <Button key="add" variant="outline" onClick={addMemberAgain}>
                Add New Member
              </Button>
            ]}
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Add New Member</h1>
            <p className="dashboard-subtitle">Register a new member to the church community</p>
          </div>

          <Card style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Formik
              initialValues={{
                fullName: '',
                address: '',
                email: '',
                phoneNumber: '',
                image: '',
                gender: '',
                dob: '',
                maritalStatus: ''
              }}
              validationSchema={memberSchema}
              onSubmit={handleAddMember}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <InputField
                    id="fullName"
                    name="fullName"
                    type="text"
                    label="Full Name"
                    placeholder="Enter full name"
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
                    placeholder="Enter email address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                  />

                  <InputField
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phoneNumber && errors.phoneNumber}
                    required
                  />

                  <InputField
                    id="address"
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="Enter address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && errors.address}
                    required
                  />

                  <InputField
                    id="dob"
                    name="dob"
                    type="text"
                    label="Date of Birth"
                    placeholder="YYYY.MM.DD (e.g., 1990.01.15)"
                    value={values.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.dob && errors.dob}
                    required
                  />

                  <InputField
                    id="image"
                    name="image"
                    type="text"
                    label="Image URL (Optional)"
                    placeholder="Enter image URL"
                    value={values.image}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className="input-field">
                    <label className="input-label">
                      Gender <span className="required-asterisk">*</span>
                    </label>
                    <Radio.Group
                      name="gender"
                      value={values.gender}
                      onChange={(e) => setFieldValue('gender', e.target.value)}
                      style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}
                    >
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                    {errors.gender && touched.gender && (
                      <span className="error-message">{errors.gender}</span>
                    )}
                  </div>

                  <div className="input-field">
                    <label className="input-label">
                      Marital Status <span className="required-asterisk">*</span>
                    </label>
                    <Select
                      placeholder="Select marital status"
                      value={values.maritalStatus}
                      onChange={(value) => setFieldValue('maritalStatus', value)}
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      size="large"
                    >
                      <Option value="Single">Single</Option>
                      <Option value="Married">Married</Option>
                    </Select>
                    {errors.maritalStatus && touched.maritalStatus && (
                      <span className="error-message">{errors.maritalStatus}</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting}
                    className="mt-3"
                  >
                    {isSubmitting ? 'Adding Member...' : 'Add Member'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddMember;
