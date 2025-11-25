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
                  {item.eventTitle}
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
              <h1 className="dashboard-title">Church Events</h1>
              <p className="dashboard-subtitle">View and manage upcoming church events</p>
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
              Add New Event
            </Button>
          </div>

          {events.length > 0 && (
            <Card style={{ marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
                Upcoming Events
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event._id}
                    style={{
                      padding: '1rem',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--gray-200)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
                          {event.eventTitle}
                        </h3>
                        {event.eventDescription && (
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {event.eventDescription}
                          </p>
                        )}
                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <Tag color="blue">
                            {dayjs(event.startDate).format('MMM DD, YYYY')}
                          </Tag>
                          {event.location && (
                            <Tag color="green">{event.location}</Tag>
                          )}
                          {event.assignedTo && (
                            <Tag color="purple">Assigned to: {event.assignedTo}</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                description="No events scheduled"
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
