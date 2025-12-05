import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Row, Col, Statistic, Button, Progress, Tag, Calendar, Badge, Empty, Spin } from 'antd';
import {
  UserAddOutlined,
  UnorderedListOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ManOutlined,
  WomanOutlined,
  PieChartOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const Dashboard = () => {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [totalDonation, setTotalDonation] = useState(0);
  const [currentMonthDonation, setCurrentMonthDonation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(dayjs());
  const [genderData, setGenderData] = useState({
    malePercentage: 0,
    femalePercentage: 0,
    maleCount: 0,
    femaleCount: 0
  });
  const [ageData, setAgeData] = useState({
    agePercentages: {},
    ageGroups: {},
    totalWithAge: 0
  });
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const { userDetails } = useSelector(state => state.users);


  const fetchMembersDetails = async () => {
    try {
      const res = await fetch(`http://localhost:4000/member`);
      const data = await res.json();
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchDonationSum = async () => {
    try {
      const res = await fetch(`http://localhost:4000/donation-amount`);
      const data = await res.json();
      setTotalDonation(data.totalDonation || 0);
    } catch (error) {
      console.error('Error fetching donation sum:', error);
    }
  };

  const fetchCurrentMonthDonation = async () => {
    try {
      const res = await fetch(`http://localhost:4000/donation-current-month`);
      const data = await res.json();
      setCurrentMonthDonation(data.totalDonation || 0);
    } catch (error) {
      console.error('Error fetching current month donation:', error);
    }
  };

  const fetchGenderPercentage = async () => {
    try {
      const res = await fetch(`http://localhost:4000/gender-percentage`);
      const data = await res.json();
      setGenderData({
        malePercentage: data.malePercentage || 0,
        femalePercentage: data.femalePercentage || 0,
        maleCount: data.maleCount || 0,
        femaleCount: data.femaleCount || 0
      });
    } catch (error) {
      console.error('Error fetching gender percentage:', error);
    }
  };

  const fetchAgePercentage = async () => {
    try {
      const res = await fetch(`http://localhost:4000/age-percentage`);
      const data = await res.json();
      setAgeData({
        agePercentages: data.agePercentages || {},
        ageGroups: data.ageGroups || {},
        totalWithAge: data.totalWithAge || 0
      });
    } catch (error) {
      console.error('Error fetching age percentage:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await fetch('http://localhost:4000/event');
      const data = await res.json();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMembersDetails(),
        fetchDonationSum(),
        fetchCurrentMonthDonation(),
        fetchGenderPercentage(),
        fetchAgePercentage(),
        fetchEvents()
      ]);
      setLoading(false);
    };
    loadData();

    // Update date and time every second
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const actionButtons = [
    {
      icon: <UserAddOutlined />,
      label: 'Add Member',
      onClick: () => router.push('/members'),
      color: '#6366f1'
    },
    {
      icon: <UnorderedListOutlined />,
      label: 'View Members',
      onClick: () => router.push('/members/view-member'),
      color: '#8b5cf6'
    },
    {
      icon: <CalendarOutlined />,
      label: 'Schedule Service',
      onClick: () => router.push('/add-event'),
      color: '#f59e0b'
    },
    {
      icon: <CalendarOutlined />,
      label: 'View Events',
      onClick: () => router.push('/event'),
      color: '#ec4899'
    },
    {
      icon: <DollarCircleOutlined />,
      label: 'Add Offerings',
      onClick: () => router.push('/donation'),
      color: '#10b981'
    },
    {
      icon: <PlusCircleOutlined />,
      label: 'Add Expenses',
      onClick: () => router.push('/add-expense'),
      color: '#ff4d4f'
    },
    {
      icon: <FileTextOutlined />,
      label: 'Accounting',
      onClick: () => router.push('/accounting'),
      color: '#f59e0b'
    }
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar - Left Side */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <Card 
              style={{ 
                borderRadius: 'var(--radius-xl)',
                position: 'sticky',
                top: '2rem',
                background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--bg-primary) 100%)',
                border: '1px solid var(--gray-200)',
              }}
            >
              <h2 style={{ 
                marginBottom: '1.5rem', 
                fontSize: '1.25rem', 
                fontWeight: 600,
                color: 'var(--text-primary)',
                paddingBottom: '1rem',
                borderBottom: '2px solid var(--gray-200)',
              }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {actionButtons.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={action.onClick}
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      width: '100%',
                      justifyContent: 'flex-start',
                      height: 'auto',
                      borderRadius: 'var(--radius-lg)',
                      border: 'none',
                      transition: 'all var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = action.color;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dashboard-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 className="dashboard-title">
                    Welcome back, {userDetails?.fullName || 'User'}! 👋
                  </h1>
                  <p className="dashboard-subtitle">
                    Here's an overview of your church management
                  </p>
                </div>
                <Card
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                      {currentDateTime.format('dddd, MMMM DD, YYYY')}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                      {currentDateTime.format('hh:mm:ss A')}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
                <div className="stat-value">
                  <TeamOutlined style={{ fontSize: '2rem', marginRight: '0.5rem' }} />
                  {totalCount}
                </div>
                <div className="stat-label">Total Members</div>
              </div>

              <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
                <div className="stat-value">
                  Rs. {totalDonation.toLocaleString()}
                </div>
                <div className="stat-label">Total Offerings</div>
              </div>

              <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
                <div className="stat-value">
                  Rs. {currentMonthDonation.toLocaleString()}
                </div>
                <div className="stat-label">{dayjs().format('MMMM')} Collections</div>
              </div>
            </div>

            {/* Gender and Age Charts Row */}
            <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
              <Col xs={24} md={12}>
                <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                    Gender Distribution
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ManOutlined style={{ color: '#3b82f6', fontSize: '1.25rem' }} />
                          <span style={{ fontWeight: 600 }}>Male</span>
                        </div>
                        <Tag color="blue">{genderData.maleCount} ({genderData.malePercentage}%)</Tag>
                      </div>
                      <Progress
                        percent={genderData.malePercentage}
                        strokeColor="#3b82f6"
                        showInfo={false}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <WomanOutlined style={{ color: '#ec4899', fontSize: '1.25rem' }} />
                          <span style={{ fontWeight: 600 }}>Female</span>
                        </div>
                        <Tag color="pink">{genderData.femaleCount} ({genderData.femalePercentage}%)</Tag>
                      </div>
                      <Progress
                        percent={genderData.femalePercentage}
                        strokeColor="#ec4899"
                        showInfo={false}
                      />
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
                    Age Distribution
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {Object.keys(ageData.agePercentages || {}).map((ageGroup) => {
                      const percentage = ageData.agePercentages[ageGroup] || 0;
                      const count = ageData.ageGroups[ageGroup] || 0;
                      const colors = {
                        '0-18': '#10b981',
                        '19-30': '#3b82f6',
                        '31-50': '#f59e0b',
                        '51-70': '#8b5cf6',
                        '70+': '#ec4899'
                      };
                      return (
                        <div key={ageGroup}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>{ageGroup} years</span>
                            <Tag color={colors[ageGroup] || 'default'}>{count} ({percentage}%)</Tag>
                          </div>
                          <Progress
                            percent={percentage}
                            strokeColor={colors[ageGroup] || '#6366f1'}
                            showInfo={false}
                          />
                        </div>
                      );
                    })}
                    {ageData.totalWithAge === 0 && (
                      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                        No age data available
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Events Calendar and Latest Events Row */}
            <Row gutter={[24, 24]} style={{ marginTop: '2rem' }}>
              <Col xs={24} lg={14}>
                <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
                      Events Calendar
                    </h2>
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      onClick={() => router.push('/event')}
                      style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                        border: 'none',
                      }}
                    >
                      View All Events
                    </Button>
                  </div>

                  <Calendar
                    loading={eventsLoading}
                    dateCellRender={dateCellRender}
                    monthCellRender={monthCellRender}
                    style={{ background: 'transparent' }}
                    fullscreen={false}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={10}>
                <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
                      Latest Events
                    </h2>
                    <Button
                      type="text"
                      icon={<CalendarOutlined />}
                      onClick={() => router.push('/event')}
                    >
                      View All
                    </Button>
                  </div>

                  {eventsLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <Spin size="large" />
                    </div>
                  ) : events.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                      {events
                        .filter(event => {
                          // Only show upcoming events (from today onwards)
                          const eventDate = new Date(event.startDate);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return eventDate >= today;
                        })
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                        .slice(0, 10)
                        .map((event) => {
                          if (event.type === 'service') {
                            // Saturday Service Schedule
                            return (
                              <div
                                key={event._id}
                                style={{
                                  padding: '1rem',
                                  background: 'var(--gray-50)',
                                  borderRadius: 'var(--radius-lg)',
                                  border: '1px solid var(--gray-200)',
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-base)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--gray-100)';
                                  e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'var(--gray-50)';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                onClick={() => router.push('/event')}
                              >
                                <h3 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
                                  Saturday Service, {dayjs(event.startDate).format('MMMM DD, YYYY')}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
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
                            );
                          } else {
                            // Regular Event
                            return (
                              <div
                                key={event._id}
                                style={{
                                  padding: '1rem',
                                  background: 'var(--gray-50)',
                                  borderRadius: 'var(--radius-lg)',
                                  border: '1px solid var(--gray-200)',
                                  cursor: 'pointer',
                                  transition: 'all var(--transition-base)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--gray-100)';
                                  e.currentTarget.style.transform = 'translateX(5px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'var(--gray-50)';
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                onClick={() => router.push('/event')}
                              >
                                <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
                                  {event.eventTitle} - {dayjs(event.startDate).format('dddd, MMMM DD, YYYY')}
                                </h3>
                                {event.eventDescription && (
                                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {event.eventDescription}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <Empty
                        description="No events scheduled"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        imageStyle={{ height: 60 }}
                      />
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
