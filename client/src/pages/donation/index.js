import React, { useState } from 'react';
import { DatePicker, Card, Select } from 'antd';
const { Option } = Select;
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import dayjs from 'dayjs';

const Donation = () => {
  const [donationDate, setDonationDate] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userDetails } = useSelector(state => state.users);

  const donationSchema = Yup.object().shape({
    donationAmount: Yup.number()
      .required('Offering amount is required')
      .positive('Amount must be positive')
      .min(1, 'Minimum offering is Rs. 1'),
    donationType: Yup.string()
      .required('Offering type is required')
      .oneOf(['Tithe', 'General Offering', 'Special Offering'], 'Please select a valid offering type'),
    remarks: Yup.string().when('donationType', {
      is: 'Special Offering',
      then: (schema) => schema.required('Remarks are required for Special Offering'),
      otherwise: (schema) => schema,
    }),
  });

  const onChange = (date) => {
    const isoFormattedDate = date ? date.toISOString() : null;
    setDonationDate(isoFormattedDate);
  };

  const handleAddDonation = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...values,
        donationDate: donationDate,
        user: userDetails?.fullName || values.user || 'Anonymous',
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
      
      const res = await fetch('http://localhost:4000/donation', requestOptions);
      const data = await res.json();
      
      if (data) {
        messageApi.success(data.msg || 'Offering added successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        messageApi.error('Failed to add donation');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Error adding donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Add Offerings Collection</h1>
            <p className="dashboard-subtitle">Record a new offering to the church</p>
          </div>

          <Card style={{ maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-xl)' }}>
            <Formik
              initialValues={{
                donationAmount: '',
                donationDate: '',
                donationType: 'General Offering',
                remarks: '',
                user: userDetails?.fullName || 'Anonymous',
              }}
              validationSchema={donationSchema}
              onSubmit={(values) => {
                const formData = {
                  ...values,
                  donationDate,
                };
                handleAddDonation(formData);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <div className="input-field">
                    <label className="input-label">
                      Offering Date <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={onChange}
                      style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                      size="large"
                      placeholder="Select offering date"
                    />
                    {errors.donationDate && touched.donationDate && (
                      <span className="error-message">{errors.donationDate}</span>
                    )}
                  </div>

                  <InputField
                    id="donationAmount"
                    name="donationAmount"
                    type="number"
                    label="Offering Amount (Rs.)"
                    placeholder="Enter offering amount"
                    value={values.donationAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.donationAmount && errors.donationAmount}
                    required
                  />

                  <div className="input-field">
                    <label className="input-label">
                      Donation Type <span className="required-asterisk">*</span>
                    </label>
                    <Select
                      placeholder="Select donation type"
                      value={values.donationType}
                      onChange={(value) => {
                        setFieldValue('donationType', value);
                        // Clear remarks if not Special Offering
                        if (value !== 'Special Offering') {
                          setFieldValue('remarks', '');
                        }
                      }}
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      size="large"
                    >
                      <Option value="Tithe">Tithe</Option>
                      <Option value="General Offering">General Offering</Option>
                      <Option value="Special Offering">Special Offering</Option>
                    </Select>
                    {errors.donationType && touched.donationType && (
                      <span className="error-message">{errors.donationType}</span>
                    )}
                  </div>

                  {values.donationType === 'Special Offering' && (
                    <div className="input-field">
                      <label className="input-label">
                        Remarks <span className="required-asterisk">*</span>
                      </label>
                      <textarea
                        id="remarks"
                        name="remarks"
                        placeholder="Enter remarks for this special offering (required)"
                        value={values.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`form-input ${errors.remarks && touched.remarks ? 'input-error' : ''}`}
                        rows={4}
                        style={{ resize: 'vertical' }}
                      />
                      {errors.remarks && touched.remarks && (
                        <span className="error-message">{errors.remarks}</span>
                      )}
                    </div>
                  )}

                  <div className="input-field">
                    <label className="input-label">Entered By</label>
                    <input
                      type="text"
                      value={userDetails?.fullName || 'Anonymous'}
                      disabled
                      className="form-input"
                      style={{ backgroundColor: 'var(--gray-100)', cursor: 'not-allowed' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting || !donationDate}
                    className="mt-3"
                  >
                    {isSubmitting ? 'Adding Offering...' : 'Add Offering'}
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

export default Donation;
