import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Card, Empty, Tag, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const App = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      const eventsRes = await fetch('http://localhost:4000/event');
      const eventsData = await eventsRes.json();
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return events.filter((event) => {
      const eventDate = dayjs(event.startDate).format('YYYY-MM-DD');
      return eventDate === dateStr;
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li key={item._id} style={{ marginBottom: '0.25rem' }}>
            <Badge
              status="success"
              text={
                <span style={{ fontSize: '0.75rem' }}>
                  {item.eventTitle || 'Saturday Service'}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    const monthEvents = events.filter((event) => {
      const eventDate = dayjs(event.startDate);
      return eventDate.year() === value.year() && eventDate.month() === value.month();
    });
    
    if (monthEvents.length === 0) {
      return null;
    }
    
    return (
      <div className="notes-month">
        <section>{monthEvents.length} events</section>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="dashboard-title">Saturday Service Schedule</h1>
              <p className="dashboard-subtitle">View and manage Saturday service schedules</p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => router.push('/add-event')}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                border: 'none',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              Schedule Service
            </Button>
          </div>

          {events.length > 0 && (
            <Card style={{ marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                Upcoming Services & Events
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events
                  .filter(event => {
                    const eventDate = new Date(event.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return eventDate >= today;
                  })
                  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                  .slice(0, 10)
                  .map((event) => {
                    if (event.type === 'service') {
                      return (
                        <div
                          key={event._id}
                          style={{
                            padding: '1.5rem',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--gray-200)',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
                                Saturday Service
                              </h3>
                              <Tag color="blue" style={{ marginBottom: '1rem' }}>
                                {dayjs(event.startDate).format('dddd, MMMM DD, YYYY')}
                              </Tag>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {event.serviceCoordinator && (
                                <div>
                                  <strong>Service Coordinator:</strong> {event.serviceCoordinator}
                                </div>
                              )}
                              {event.choirLead && (
                                <div>
                                  <strong>Choir Lead:</strong> {event.choirLead}
                                </div>
                              )}
                              {event.specialPrayers && (
                                <div>
                                  <strong>Special Prayers:</strong> {event.specialPrayers}
                                </div>
                              )}
                              {event.sermonSpeaker && (
                                <div>
                                  <strong>Sermon / Speaker:</strong> {event.sermonSpeaker}
                                </div>
                              )}
                              {event.offeringsCollectionTeam && (
                                <div>
                                  <strong>Offerings Collection Team:</strong> {event.offeringsCollectionTeam}
                                </div>
                              )}
                              {event.offeringsCountingTeam && (
                                <div>
                                  <strong>Offerings Counting Team:</strong> {event.offeringsCountingTeam}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={event._id}
                          style={{
                            padding: '1.5rem',
                            background: 'var(--gray-50)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--gray-200)',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
                                {event.eventTitle}
                              </h3>
                              <Tag color="green" style={{ marginBottom: '1rem' }}>
                                {dayjs(event.startDate).format('dddd, MMMM DD, YYYY')}
                              </Tag>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {event.eventDescription && (
                                <div style={{ marginBottom: '0.5rem' }}>
                                  <strong>Description:</strong> {event.eventDescription}
                                </div>
                              )}
                              {event.location && (
                                <div>
                                  <strong>Location:</strong> {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </Card>
          )}

          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Calendar
              loading={loading}
              dateCellRender={dateCellRender}
              monthCellRender={monthCellRender}
              style={{ background: 'transparent' }}
            />
          </Card>

          {!loading && events.length === 0 && (
            <Card style={{ borderRadius: 'var(--radius-xl)', textAlign: 'center', padding: '3rem' }}>
              <Empty
                description="No services scheduled"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
