import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Avatar, Card, Button, Space, Modal, message } from 'antd';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '@/components/InputField';
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  phoneNumber: Yup.string()
    .required('Required'),
});

const ChangePassForm = ({ onCancel }) => {
  const [msg, contextHolder] = message.useMessage();
  const { userDetails } = useSelector(state => state.users);

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(5, 'Password must be at least 5 characters')
      .required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleChangePassword = async (values) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          userId: userDetails._id,
        }),
      };
      const res = await fetch(`http://localhost:4000/change-password/${userDetails._id}`, requestOptions);
      const data = await res.json();
      
      if (data && res.status === 200) {
        msg.success('Password changed successfully');
        onCancel();
      } else {
        msg.error(data.msg || 'Failed to change password');
      }
    } catch (error) {
      msg.error('An error occurred');
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={passwordSchema}
        onSubmit={handleChangePassword}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <InputField
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentPassword && errors.currentPassword}
              showPasswordToggle
              required
            />

            <InputField
              id="newPassword"
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword && errors.newPassword}
              showPasswordToggle
              required
            />

            <InputField
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={values.confirmNewPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmNewPassword && errors.confirmNewPassword}
              showPasswordToggle
              required
            />

            <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Space>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default function Profile() {
  const { userDetails } = useSelector(state => state.users);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      };
      const res = await fetch(`http://localhost:4000/users/${userDetails._id}`, requestOptions);
      const data = await res.json();
      
      if (data && res.status === 200) {
        dispatch(setUserDetails({ ...data, token: userDetails.token }));
        msg.success('Profile updated successfully');
        setIsAccountModalOpen(false);
      } else {
        msg.error(data.msg || 'Failed to update profile');
      }
    } catch (error) {
      msg.error('An error occurred');
      setIsAccountModalOpen(false);
      console.log(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Your Profile</h1>
            <p className="dashboard-subtitle">Manage your account settings and preferences</p>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card
                style={{
                  borderRadius: 'var(--radius-xl)',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  size={120}
                  style={{
                    backgroundColor: '#fde3cf',
                    color: '#f56a00',
                    fontSize: '3rem',
                    marginBottom: '1rem',
                  }}
                  icon={<UserOutlined />}
                >
                  {userDetails?.fullName?.[0]?.toUpperCase()}
                </Avatar>
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                  {userDetails?.fullName}
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  {userDetails?.email}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <Card
                title="Account Details"
                extra={
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsAccountModalOpen(true)}
                  >
                    Edit
                  </Button>
                }
                style={{ borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }}
              >
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong>Full Name:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      {userDetails?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      <a href={`mailto:${userDetails?.email}`} style={{ color: 'var(--primary)' }}>
                        {userDetails?.email || 'N/A'}
                      </a>
                    </p>
                  </div>
                  <div>
                    <strong>Phone:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      {userDetails?.phoneNumber || 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                title="Security"
                style={{ borderRadius: 'var(--radius-xl)' }}
              >
                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={() => setIsPasswordModalOpen(true)}
                  size="large"
                >
                  Change Password
                </Button>
              </Card>
            </Col>
          </Row>

          <Modal
            title="Edit Account Details"
            open={isAccountModalOpen}
            onCancel={() => setIsAccountModalOpen(false)}
            footer={null}
            width={600}
          >
            <Formik
              initialValues={{
                fullName: userDetails?.fullName || '',
                email: userDetails?.email || '',
                phoneNumber: userDetails?.phoneNumber || '',
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
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

                  <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button onClick={() => setIsAccountModalOpen(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                      Save Changes
                    </Button>
                  </Space>
                </Form>
              )}
            </Formik>
          </Modal>

          <Modal
            title="Change Password"
            open={isPasswordModalOpen}
            onCancel={() => setIsPasswordModalOpen(false)}
            footer={null}
            width={600}
          >
            <ChangePassForm onCancel={() => setIsPasswordModalOpen(false)} />
          </Modal>
        </div>
      </div>
      <Footer />
    </>
  );
}
