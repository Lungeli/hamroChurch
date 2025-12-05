import React, { useState } from 'react';
import { DatePicker, Card, Select, InputNumber, Input } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { useRouter } from 'next/router';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import dayjs from 'dayjs';

const BUDGET_HEADS = [
  'Missions & Outreach',
  'Assemblies of God (AG) Giving',
  'Building & Maintenance',
  'Ministry & Worship',
  'Youth Ministry',
  'Other Ministries (Children, Women, Men, Prayer cells, etc.)',
  'Church Operations / Admin',
  'Emergency / Reserve / Monthly Savings'
];

const AddExpense = () => {
  const router = useRouter();
  const [expenseDate, setExpenseDate] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userDetails } = useSelector(state => state.users);

  const expenseSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Expense amount is required')
      .positive('Amount must be positive')
      .min(0.01, 'Minimum expense is Rs. 0.01'),
    budgetHead: Yup.string()
      .required('Budget head is required')
      .oneOf(BUDGET_HEADS, 'Please select a valid budget head'),
    description: Yup.string()
      .required('Description is required')
      .min(3, 'Description must be at least 3 characters'),
  });

  const onChange = (date) => {
    const isoFormattedDate = date ? date.toISOString() : null;
    setExpenseDate(isoFormattedDate);
  };

  const handleAddExpense = async (values) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...values,
        expenseDate: expenseDate,
        recordedBy: userDetails?.fullName || 'Admin',
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
      
      const res = await fetch('http://localhost:4000/expense', requestOptions);
      const data = await res.json();
      
      if (data.expense || data.msg) {
        messageApi.success(data.msg || 'Expense added successfully!');
        setTimeout(() => {
          router.push('/reports');
        }, 1500);
      } else {
        messageApi.error('Failed to add expense');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Error adding expense:', error);
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
            <h1 className="dashboard-title">Add Expense</h1>
            <p className="dashboard-subtitle">Record a new expense under a budget head</p>
          </div>

          <Card style={{ maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-xl)' }}>
            <Formik
              initialValues={{
                amount: '',
                expenseDate: '',
                budgetHead: '',
                description: '',
              }}
              validationSchema={expenseSchema}
              onSubmit={(values) => {
                const formData = {
                  ...values,
                  expenseDate,
                };
                handleAddExpense(formData);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form>
                  <div className="input-field">
                    <label className="input-label">
                      Expense Date <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={onChange}
                      style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                      size="large"
                      placeholder="Select expense date"
                    />
                    {errors.expenseDate && touched.expenseDate && (
                      <span className="error-message">{errors.expenseDate}</span>
                    )}
                  </div>

                  <div className="input-field">
                    <label className="input-label">
                      Budget Head <span className="required-asterisk">*</span>
                    </label>
                    <Select
                      placeholder="Select budget head"
                      value={values.budgetHead}
                      onChange={(value) => setFieldValue('budgetHead', value)}
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      size="large"
                    >
                      {BUDGET_HEADS.map(head => (
                        <Option key={head} value={head}>{head}</Option>
                      ))}
                    </Select>
                    {errors.budgetHead && touched.budgetHead && (
                      <span className="error-message">{errors.budgetHead}</span>
                    )}
                  </div>

                  <div className="input-field">
                    <label className="input-label">
                      Amount (Rs.) <span className="required-asterisk">*</span>
                    </label>
                    <InputNumber
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      size="large"
                      min={0}
                      step={0.01}
                      placeholder="Enter expense amount"
                      value={values.amount}
                      onChange={(value) => setFieldValue('amount', value)}
                      formatter={value => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/Rs.\s?|(,*)/g, '')}
                    />
                    {errors.amount && touched.amount && (
                      <span className="error-message">{errors.amount}</span>
                    )}
                  </div>

                  <div className="input-field">
                    <label className="input-label">
                      Description <span className="required-asterisk">*</span>
                    </label>
                    <TextArea
                      rows={4}
                      placeholder="Enter expense description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="description"
                      className={`form-input ${errors.description && touched.description ? 'input-error' : ''}`}
                      style={{ marginTop: '0.5rem' }}
                    />
                    {errors.description && touched.description && (
                      <span className="error-message">{errors.description}</span>
                    )}
                  </div>

                  <div className="input-field">
                    <label className="input-label">Recorded By</label>
                    <input
                      type="text"
                      value={userDetails?.fullName || 'Admin'}
                      disabled
                      className="form-input"
                      style={{ backgroundColor: 'var(--gray-100)', cursor: 'not-allowed' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting || !expenseDate}
                    className="mt-3"
                  >
                    {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
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

export default AddExpense;

