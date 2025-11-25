import React, { useState } from 'react';
import { Card } from 'antd';
import { DatePicker } from 'antd';
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

const AddEvent = () => {
  const router = useRouter();
  const [eventDate, setEventDate] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userDetails } = useSelector(state => state.users);

  const eventSchema = Yup.object().shape({
    eventTitle: Yup.string()
      .required('Event title is required')
      .min(3, 'Title must be at least 3 characters'),
    eventDescription: Yup.string(),
    location: Yup.string(),
    assignedTo: Yup.string(),
  });

  const handleAddEvent = async (values) => {
    if (!eventDate) {
      messageApi.error('Please select an event date');
      return;
    }

    setIsSubmitting(true);
    try {
      // Set both startDate and endDate to the same date for single-day events
      const dateISO = eventDate.toISOString();
      const formData = {
        ...values,
        startDate: dateISO,
        endDate: dateISO,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };

      const res = await fetch('http://localhost:4000/event', requestOptions);
      const data = await res.json();

      if (data) {
        messageApi.success(data.msg || 'Event added successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        messageApi.error('Failed to add event');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Error adding event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date) => {
    setEventDate(date);
  };

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Add New Event</h1>
            <p className="dashboard-subtitle">Create a new church event</p>
          </div>

          <Card style={{ maxWidth: '700px', margin: '0 auto', borderRadius: 'var(--radius-xl)' }}>
            <Formik
              initialValues={{
                eventTitle: '',
                eventDescription: '',
                location: '',
                assignedTo: userDetails?.fullName || '',
              }}
              validationSchema={eventSchema}
              onSubmit={handleAddEvent}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                  <InputField
                    id="eventTitle"
                    name="eventTitle"
                    type="text"
                    label="Event Title"
                    placeholder="Enter event title"
                    value={values.eventTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.eventTitle && errors.eventTitle}
                    required
                  />

                  <div className="input-field">
                    <label className="input-label">
                      Event Description
                    </label>
                    <textarea
                      id="eventDescription"
                      name="eventDescription"
                      placeholder="Enter event description"
                      value={values.eventDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-input"
                      rows={4}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="input-field">
                    <label className="input-label">
                      Event Date <span className="required-asterisk">*</span>
                    </label>
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={handleDateChange}
                      value={eventDate ? dayjs(eventDate) : null}
                      style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                      size="large"
                      placeholder="Select event date"
                    />
                    {!eventDate && (
                      <span className="error-message">Please select an event date</span>
                    )}
                  </div>

                  <InputField
                    id="location"
                    name="location"
                    type="text"
                    label="Location"
                    placeholder="Enter event location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.location && errors.location}
                  />

                  <InputField
                    id="assignedTo"
                    name="assignedTo"
                    type="text"
                    label="Assigned To"
                    placeholder="Enter person assigned to this event"
                    value={values.assignedTo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.assignedTo && errors.assignedTo}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting || !eventDate}
                    className="mt-3"
                  >
                    {isSubmitting ? 'Adding Event...' : 'Add Event'}
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

export default AddEvent;
