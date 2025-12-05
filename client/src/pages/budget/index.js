import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, DatePicker, message, Modal, Progress, Row, Col, Space, Divider } from 'antd';
import { PlusOutlined, ThunderboltOutlined, SettingOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const { Option } = Select;
const { MonthPicker } = DatePicker;

const Budget = () => {
  const router = useRouter();
  const { userDetails } = useSelector(state => state.users);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [lastMonthIncome, setLastMonthIncome] = useState(null);
  const [budget, setBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [autoAllocating, setAutoAllocating] = useState(false);

  useEffect(() => {
    if (selectedMonth) {
      fetchLastMonthIncome();
      fetchBudget();
      fetchBudgetSummary();
    }
  }, [selectedMonth]);

  useEffect(() => {
    // Auto-allocate budget on component mount if no budget exists for current month
    const checkAndAutoAllocate = async () => {
      const now = dayjs();
      const month = now.month() + 1;
      const year = now.year();
      
      try {
        const res = await fetch(`http://localhost:4000/budget?month=${month}&year=${year}`);
        const data = await res.json();
        
        if (!data.budget) {
          // No budget exists, but don't auto-allocate automatically
          // User can click the button to allocate
        }
      } catch (error) {
        // Budget doesn't exist, which is fine
      }
    };
    
    checkAndAutoAllocate();
  }, []);

  const fetchLastMonthIncome = async () => {
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      const res = await fetch(`http://localhost:4000/last-month-income?month=${month}&year=${year}`);
      const data = await res.json();
      setLastMonthIncome(data);
    } catch (error) {
      console.error('Error fetching last month income:', error);
      messageApi.error('Failed to fetch last month income');
    }
  };

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      const res = await fetch(`http://localhost:4000/budget?month=${month}&year=${year}`);
      const data = await res.json();
      
      if (data.budget) {
        setBudget(data.budget);
      } else {
        setBudget(null);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetSummary = async () => {
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      const res = await fetch(`http://localhost:4000/budget-summary?month=${month}&year=${year}`);
      const data = await res.json();
      
      if (data.summary) {
        setBudgetSummary(data);
      } else {
        setBudgetSummary(null);
      }
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      setBudgetSummary(null);
    }
  };


  const handleAutoAllocate = async () => {
    setAutoAllocating(true);
    try {
      const res = await fetch('http://localhost:4000/budget/auto-allocate', {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.budget) {
        messageApi.success('Budget automatically allocated successfully!');
        const now = dayjs();
        setSelectedMonth(now);
        setTimeout(() => {
          fetchBudget();
          fetchBudgetSummary();
        }, 500);
      } else {
        messageApi.warning(data.msg || 'Could not auto-allocate budget');
      }
    } catch (error) {
      console.error('Error auto-allocating budget:', error);
      messageApi.error('Failed to auto-allocate budget');
    } finally {
      setAutoAllocating(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!lastMonthIncome || lastMonthIncome.totalIncome === 0) {
      messageApi.warning('No income data available for last month');
      return;
    }

    setLoading(true);
    try {
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      
      const res = await fetch('http://localhost:4000/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          year,
          totalIncome: lastMonthIncome.totalIncome,
          notes,
          createdBy: userDetails?.fullName || 'Admin'
        })
      });

      const data = await res.json();
      
      if (data.budget) {
        messageApi.success('Budget allocated successfully!');
        setIsModalVisible(false);
        setNotes('');
        fetchBudget();
        fetchBudgetSummary();
      } else {
        messageApi.error(data.msg || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      messageApi.error('Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  const budgetColumns = [
    {
      title: 'Budget Head',
      dataIndex: 'headName',
      key: 'headName',
      width: '20%',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      width: '10%',
      render: (percentage) => `${percentage}%`,
    },
    {
      title: 'Budget Allocation (Carry Over)',
      dataIndex: 'carryOverAmount',
      key: 'carryOverAmount',
      width: '12%',
      render: (amount) => (
        <span style={{ color: amount > 0 ? '#1890ff' : '#999' }}>
          Rs. {(amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'New Allocation',
      dataIndex: 'allocatedAmount',
      key: 'allocatedAmount',
      width: '12%',
      render: (amount) => `Rs. ${amount.toLocaleString()}`,
    },
    {
      title: 'Expenses of Month',
      dataIndex: 'totalExpenses',
      key: 'totalExpenses',
      width: '12%',
      render: (expenses) => (
        <span style={{ color: '#ff4d4f' }}>
          Rs. {(expenses || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Total Expenses',
      key: 'totalExpensesDisplay',
      width: '12%',
      render: (_, record) => {
        const expenses = record.totalExpenses || 0;
        return (
          <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
            Rs. {expenses.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: 'Remaining Amount',
      dataIndex: 'remainingAmount',
      key: 'remainingAmount',
      width: '12%',
      render: (amount, record) => {
        const totalAvailable = record.allocatedAmount + (record.carryOverAmount || 0);
        const expenses = record.totalExpenses || 0;
        const remaining = totalAvailable - expenses;
        return (
          <span style={{ color: remaining < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
            Rs. {remaining.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: 'Utilization',
      key: 'utilization',
      width: '10%',
      render: (_, record) => {
        const totalAvailable = record.allocatedAmount + (record.carryOverAmount || 0);
        const expenses = record.totalExpenses || 0;
        const percentage = totalAvailable > 0 
          ? Math.round((expenses / totalAvailable) * 100) 
          : 0;
        const status = percentage > 100 ? 'exception' : percentage > 80 ? 'active' : 'success';
        return (
          <Progress 
            percent={percentage} 
            status={status}
            size="small"
            format={(percent) => `${percent}%`}
          />
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Budget Management</h1>
            <p className="dashboard-subtitle">Allocate and track budget by budget heads</p>
          </div>

          {/* Month Selector and Create Budget */}
          <Card style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Select Month & Year
                </label>
                <MonthPicker
                  value={selectedMonth}
                  onChange={(date) => setSelectedMonth(date || dayjs())}
                  format="MMMM YYYY"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Col>
              <Col xs={24} sm={12} md={16} style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={handleAutoAllocate}
                    disabled={!lastMonthIncome || lastMonthIncome.totalIncome === 0}
                    loading={autoAllocating}
                    size="large"
                    style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                  >
                    Auto Allocate
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    disabled={!lastMonthIncome || lastMonthIncome.totalIncome === 0}
                    size="large"
                  >
                    Manual Allocate
                  </Button>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => router.push('/budget-settings')}
                    size="large"
                  >
                    Budget Settings
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Budget Table */}
          {budget ? (
            <Card 
              title={`Budget Allocation - ${selectedMonth.format('MMMM YYYY')}`}
              style={{ borderRadius: 'var(--radius-xl)' }}
            >
              <Table
                columns={budgetColumns}
                dataSource={budgetSummary?.summary || budget.budgetHeads}
                rowKey="headName"
                loading={loading}
                pagination={false}
                scroll={{ x: true }}
              />
            </Card>
          ) : (
            <Card style={{ borderRadius: 'var(--radius-xl)', textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                No budget allocated for {selectedMonth.format('MMMM YYYY')}
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                Click "Auto Allocate" to automatically create a budget based on last month's income
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Budget Modal */}
      <Modal
        title="Allocate Budget"
        open={isModalVisible}
        onOk={handleCreateBudget}
        onCancel={() => {
          setIsModalVisible(false);
          setNotes('');
        }}
        confirmLoading={loading}
        okText="Allocate"
        cancelText="Cancel"
      >
        {lastMonthIncome && (
          <div>
            <p><strong>Month:</strong> {selectedMonth.format('MMMM YYYY')}</p>
            <p><strong>Total Income (Last Month):</strong> Rs. {lastMonthIncome.totalIncome.toLocaleString()}</p>
            <Divider />
            <p style={{ marginBottom: '0.5rem' }}>Budget Allocation Breakdown:</p>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Missions & Outreach: 25%</li>
              <li>Assemblies of God (AG) Giving: 20%</li>
              <li>Building & Maintenance: 18%</li>
              <li>Ministry & Worship: 12%</li>
              <li>Youth Ministry: 8%</li>
              <li>Other Ministries: 7%</li>
              <li>Church Operations / Admin: 5%</li>
              <li>Emergency / Reserve / Monthly Savings: 5%</li>
            </ul>
            <div style={{ 
              padding: '0.75rem', 
              backgroundColor: '#e6f7ff', 
              borderRadius: 'var(--radius-md)',
              marginTop: '1rem',
              border: '1px solid #91d5ff'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#0050b3' }}>
                <strong>ℹ️ Workflow:</strong> The system will automatically:
                <br />1. Calculate carry-over from previous month's remaining balances
                <br />2. Add new allocation based on last month's income
                <br />3. Track expenses under each budget head
                <br />4. Calculate remaining balance to carry over to next month
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this budget allocation..."
                rows={3}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}
              />
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default Budget;

