import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
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
  const [activeTab, setActiveTab] = useState('service');
  const { userDetails } = useSelector(state => state.users);

  const serviceSchema = Yup.object().shape({
    serviceCoordinator: Yup.string(),
    choirLead: Yup.string(),
    specialPrayers: Yup.string(),
    sermonSpeaker: Yup.string(),
    offeringsCollectionTeam: Yup.string(),
    offeringsCountingTeam: Yup.string(),
  });

  const eventSchema = Yup.object().shape({
    eventTitle: Yup.string().required('Event name is required'),
    eventDescription: Yup.string(),
    location: Yup.string(),
  });

  const handleAddService = async (values) => {
    if (!eventDate) {
      messageApi.error('Please select a service date');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateISO = eventDate.toISOString();
      const formData = {
        type: 'service',
        eventTitle: 'Saturday Service',
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
        messageApi.success(data.msg || 'Service schedule saved successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        messageApi.error('Failed to save schedule');
      }
    } catch (error) {
      messageApi.error('An error occurred. Please try again.');
      console.error('Error adding service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvent = async (values) => {
    if (!eventDate) {
      messageApi.error('Please select an event date');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateISO = eventDate.toISOString();
      const formData = {
        type: 'event',
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
            <h1 className="dashboard-title">Add Event or Schedule Service</h1>
            <p className="dashboard-subtitle">Create a new event or schedule a Saturday service</p>
          </div>

          <Card style={{ maxWidth: '700px', margin: '0 auto', borderRadius: 'var(--radius-xl)' }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'service',
                  label: 'Schedule Service',
                  children: (
                    <Formik
                      initialValues={{
                        serviceCoordinator: '',
                        choirLead: '',
                        specialPrayers: '',
                        sermonSpeaker: '',
                        offeringsCollectionTeam: '',
                        offeringsCountingTeam: '',
                      }}
                      validationSchema={serviceSchema}
                      onSubmit={handleAddService}
                    >
                      {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
                          <div className="input-field">
                            <label className="input-label">
                              Service Date <span className="required-asterisk">*</span>
                            </label>
                            <DatePicker
                              format="YYYY-MM-DD"
                              onChange={handleDateChange}
                              value={eventDate ? dayjs(eventDate) : null}
                              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
                              size="large"
                              placeholder="Select service date"
                            />
                            {!eventDate && (
                              <span className="error-message">Please select a service date</span>
                            )}
                          </div>

                          <InputField
                            id="serviceCoordinator"
                            name="serviceCoordinator"
                            type="text"
                            label="Service Coordinator"
                            placeholder="Enter service coordinator name"
                            value={values.serviceCoordinator}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.serviceCoordinator && errors.serviceCoordinator}
                          />

                          <InputField
                            id="choirLead"
                            name="choirLead"
                            type="text"
                            label="Choir Lead"
                            placeholder="Enter choir lead name"
                            value={values.choirLead}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.choirLead && errors.choirLead}
                          />

                          <InputField
                            id="specialPrayers"
                            name="specialPrayers"
                            type="text"
                            label="Special Prayers"
                            placeholder="Enter person for special prayers"
                            value={values.specialPrayers}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.specialPrayers && errors.specialPrayers}
                          />

                          <InputField
                            id="sermonSpeaker"
                            name="sermonSpeaker"
                            type="text"
                            label="Sermon / Speaker"
                            placeholder="Enter sermon speaker name"
                            value={values.sermonSpeaker}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.sermonSpeaker && errors.sermonSpeaker}
                          />

                          <InputField
                            id="offeringsCollectionTeam"
                            name="offeringsCollectionTeam"
                            type="text"
                            label="Offerings Collection Team"
                            placeholder="Enter offerings collection team members"
                            value={values.offeringsCollectionTeam}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.offeringsCollectionTeam && errors.offeringsCollectionTeam}
                          />

                          <InputField
                            id="offeringsCountingTeam"
                            name="offeringsCountingTeam"
                            type="text"
                            label="Offerings Counting Team"
                            placeholder="Enter offerings counting team members"
                            value={values.offeringsCountingTeam}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.offeringsCountingTeam && errors.offeringsCountingTeam}
                          />

                          <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={isSubmitting || !eventDate}
                            className="mt-3"
                          >
                            {isSubmitting ? 'Saving Schedule...' : 'Save Schedule'}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  ),
                },
                {
                  key: 'event',
                  label: 'Add Event',
                  children: (
                    <Formik
                      initialValues={{
                        eventTitle: '',
                        eventDescription: '',
                        location: '',
                      }}
                      validationSchema={eventSchema}
                      onSubmit={handleAddEvent}
                    >
                      {({ values, errors, touched, handleChange, handleBlur }) => (
                        <Form>
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
                            id="eventTitle"
                            name="eventTitle"
                            type="text"
                            label="Event Name"
                            placeholder="Enter event name"
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
                  ),
                },
              ]}
            />
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddEvent;
