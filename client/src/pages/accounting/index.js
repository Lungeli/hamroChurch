import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Space, Statistic, Spin, DatePicker } from 'antd';
import {
  FileTextOutlined,
  PieChartOutlined,
  DollarCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const { MonthPicker } = DatePicker;

const Accounting = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [currentMonthExpenditure, setCurrentMonthExpenditure] = useState(0);
  const [currentMonthData, setCurrentMonthData] = useState({
    totalIncome: 0,
    agGiving: { allocatedAmount: 0 },
    missions: { allocatedAmount: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentMonthData();
    fetchCurrentMonthExpenditure();
  }, [selectedMonth]);

  const fetchCurrentMonthExpenditure = async () => {
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      
      const res = await fetch(`http://localhost:4000/expense-summary?month=${month}&year=${year}`);
      const data = await res.json();
      setCurrentMonthExpenditure(data.totalExpenses || 0);
    } catch (error) {
      console.error('Error fetching month expenditure:', error);
      setCurrentMonthExpenditure(0);
    }
  };

  const fetchCurrentMonthData = async () => {
    try {
      setLoading(true);
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();

      // Calculate date range for selected month
      const startOfMonth = selectedMonth.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = selectedMonth.endOf('month').format('YYYY-MM-DD');

      // Fetch donations for selected month (totalIncome)
      let totalIncome = 0;
      try {
        const donationRes = await fetch(`http://localhost:4000/donations?fromDate=${startOfMonth}&toDate=${endOfMonth}`);
        const donationData = await donationRes.json();
        if (donationData.donations && Array.isArray(donationData.donations)) {
          totalIncome = donationData.donations.reduce((sum, donation) => sum + (donation.donationAmount || 0), 0);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      }

      // Fetch budget summary for selected month to get AG Giving and Missions allocations
      let agGiving = { allocatedAmount: 0 };
      let missions = { allocatedAmount: 0 };

      try {
        const budgetRes = await fetch(`http://localhost:4000/budget-summary?month=${month}&year=${year}`);
        const budgetData = await budgetRes.json();
        
        if (budgetData.summary) {
          // Find AG Giving and Missions & Outreach in the summary
          const agGivingHead = budgetData.summary.find(head => 
            head.headName === 'Assemblies of God (AG) Giving' || 
            head.headName === 'AG Giving' || 
            head.headName === 'AG Giving / Tithe'
          );
          const missionsHead = budgetData.summary.find(head => 
            head.headName === 'Missions & Outreach'
          );

          if (agGivingHead) {
            agGiving = { allocatedAmount: agGivingHead.allocatedAmount || 0 };
          }
          if (missionsHead) {
            missions = { allocatedAmount: missionsHead.allocatedAmount || 0 };
          }
        }
      } catch (error) {
        console.error('Error fetching budget summary:', error);
        // Budget might not exist for selected month, which is okay
      }

      setCurrentMonthData({
        totalIncome,
        agGiving,
        missions
      });
    } catch (error) {
      console.error('Error fetching month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const accountingActions = [
    {
      icon: <FileTextOutlined style={{ fontSize: '2.5rem' }} />,
      title: 'Financial Reports',
      description: 'View combined donations and expenses reports with date range filters',
      onClick: () => router.push('/reports'),
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
    },
    {
      icon: <PieChartOutlined style={{ fontSize: '2.5rem' }} />,
      title: 'Budget Management',
      description: 'Allocate budgets, track expenses, and view budget summaries',
      onClick: () => router.push('/budget'),
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    }
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="dashboard-title">Accounting</h1>
              <p className="dashboard-subtitle">Manage financial reports, expenses, and budgets</p>
            </div>
            <Space wrap>
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => router.push('/donation')}
                size="large"
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
              >
                Add Offerings
              </Button>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => router.push('/add-expense')}
                size="large"
                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
              >
                Add Expenses
              </Button>
            </Space>
          </div>

          <Row gutter={[24, 24]}>
            {accountingActions.map((action, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    border: '1px solid var(--gray-200)',
                  }}
                  onClick={action.onClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: action.gradient,
                        color: 'white',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      {action.icon}
                    </div>
                    <h2
                      style={{
                        margin: '0 0 0.75rem 0',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {action.title}
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                      }}
                    >
                      {action.description}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Current Month's Data Section */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 style={{ 
                margin: 0,
                fontSize: '1.5rem', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {selectedMonth.format('MMMM')}'s Data
              </h2>
              <MonthPicker
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(date || dayjs())}
                format="MMMM YYYY"
                size="large"
                placeholder="Select Month"
                style={{ minWidth: '200px' }}
              />
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--gray-200)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Statistic
                      title="Total Offerings"
                      value={currentMonthData.totalIncome}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--gray-200)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Statistic
                      title="Total Expenditure"
                      value={currentMonthExpenditure}
                      precision={2}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--gray-200)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Statistic
                      title="AG Givings"
                      value={currentMonthData.agGiving.allocatedAmount}
                      precision={2}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card
                    style={{
                      borderRadius: 'var(--radius-xl)',
                      border: '1px solid var(--gray-200)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Statistic
                      title="Missions & Outreach"
                      value={currentMonthData.missions.allocatedAmount}
                      precision={2}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Accounting;

