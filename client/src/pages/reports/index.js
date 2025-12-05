import React, { useState, useEffect } from 'react';
import { Card, Table, Button, DatePicker, Space, Tag, Statistic, Row, Col, Tabs, message, Spin } from 'antd';
import { 
  FileTextOutlined, 
  DownloadOutlined, 
  FilterOutlined, 
  DollarOutlined,
  ReloadOutlined,
  TableOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  // Initialize with current month
  const [fromDate, setFromDate] = useState(() => {
    return dayjs().startOf('month').toDate();
  });
  const [toDate, setToDate] = useState(() => {
    return dayjs().endOf('month').toDate();
  });
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'donations', 'expenses'
  const [activeTab, setActiveTab] = useState('table');
  const [messageApi, contextHolder] = message.useMessage();

  // Load data when filters change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, activeFilter]);

  const fetchData = async () => {
    if (!fromDate || !toDate) {
      return;
    }

    setLoading(true);
    try {
      // Format dates as YYYY-MM-DD strings
      const from = dayjs(fromDate).format('YYYY-MM-DD');
      const to = dayjs(toDate).format('YYYY-MM-DD');

      // Fetch donations if showing all or donations only
      if (activeFilter === 'all' || activeFilter === 'donations') {
        const donationsRes = await fetch(`http://localhost:4000/donations?fromDate=${from}&toDate=${to}`);
        const donationsData = await donationsRes.json();
        setDonations(donationsData.donations || []);
      } else {
        setDonations([]);
      }

      // Fetch expenses if showing all or expenses only
      if (activeFilter === 'all' || activeFilter === 'expenses') {
        const expensesRes = await fetch(`http://localhost:4000/expenses?fromDate=${from}&toDate=${to}`);
        const expensesData = await expensesRes.json();
        setExpenses(expensesData.expenses || []);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      messageApi.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    if (!fromDate || !toDate) {
      messageApi.warning('Please select both From Date and To Date');
      return;
    }
    fetchData();
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setDonations([]);
    setExpenses([]);
  };

  // Prepare combined table data - filter by date range on client side as well for safety
  const combinedData = [];
  
  // Get date range for filtering
  const fromDateObj = fromDate ? dayjs(fromDate).startOf('day').toDate() : null;
  const toDateObj = toDate ? dayjs(toDate).endOf('day').toDate() : null;
  
  if (activeFilter === 'all' || activeFilter === 'donations') {
    donations.forEach((donation) => {
      const donationDate = new Date(donation.donationDate);
      // Only include if within date range
      if (fromDateObj && toDateObj) {
        if (donationDate >= fromDateObj && donationDate <= toDateObj) {
          combinedData.push({
            key: `donation-${donation._id}`,
            type: 'donation',
            date: donation.donationDate,
            description: donation.donationType || 'General Offering',
            amount: donation.donationAmount,
            recordedBy: donation.user || donation.recordedBy || 'N/A',
            remarks: donation.remarks || '-',
            ...donation
          });
        }
      } else {
        // If no date filter, include all
        combinedData.push({
          key: `donation-${donation._id}`,
          type: 'donation',
          date: donation.donationDate,
          description: donation.donationType || 'General Offering',
          amount: donation.donationAmount,
          recordedBy: donation.user || donation.recordedBy || 'N/A',
          remarks: donation.remarks || '-',
          ...donation
        });
      }
    });
  }

  if (activeFilter === 'all' || activeFilter === 'expenses') {
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.expenseDate);
      // Only include if within date range
      if (fromDateObj && toDateObj) {
        if (expenseDate >= fromDateObj && expenseDate <= toDateObj) {
          combinedData.push({
            ...expense,
            key: `expense-${expense._id}`,
            type: 'expense',
            date: expense.expenseDate,
            description: expense.description,
            budgetHead: expense.budgetHead,
            amount: -Math.abs(expense.amount), // Ensure negative for expenses
            recordedBy: expense.recordedBy || 'N/A'
          });
        }
      } else {
        // If no date filter, include all
        combinedData.push({
          ...expense,
          key: `expense-${expense._id}`,
          type: 'expense',
          date: expense.expenseDate,
          description: expense.description,
          budgetHead: expense.budgetHead,
          amount: -Math.abs(expense.amount), // Ensure negative for expenses
          recordedBy: expense.recordedBy || 'N/A'
        });
      }
    });
  }

  // Sort by date (newest first)
  combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate totals from filtered combined data
  const totalDonations = combinedData
    .filter(item => item.type === 'donation')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalExpenses = combinedData
    .filter(item => item.type === 'expense')
    .reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);
  const netAmount = totalDonations - totalExpenses;

  const columns = [
    {
      title: 'Type',
      key: 'type',
      width: 100,
      render: (_, record) => (
        <Tag color={record.type === 'donation' ? 'green' : 'red'}>
          {record.type === 'donation' ? 'Donation' : 'Expense'}
        </Tag>
      ),
      filters: [
        { text: 'Donations', value: 'donation' },
        { text: 'Expenses', value: 'expense' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('DD MMM YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Description',
      key: 'description',
      width: 250,
      render: (_, record) => {
        if (record.type === 'donation') {
          return (
            <div>
              <div style={{ fontWeight: 500 }}>{record.description}</div>
              {record.remarks && record.remarks !== '-' && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {record.remarks}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div>
              <div style={{ fontWeight: 500 }}>{record.description}</div>
              <Tag color="blue" style={{ marginTop: '0.25rem' }}>{record.budgetHead}</Tag>
            </div>
          );
        }
      },
    },
    {
      title: 'Amount (Rs.)',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount, record) => {
        const isExpense = record.type === 'expense' || amount < 0;
        const displayAmount = isExpense ? Math.abs(amount) : amount;
        return (
          <span style={{ 
            color: isExpense ? '#ff4d4f' : '#52c41a',
            fontWeight: 600 
          }}>
            {isExpense ? '-' : ''}Rs. {displayAmount.toLocaleString()}
          </span>
        );
      },
      sorter: (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
    },
    {
      title: 'Recorded By',
      dataIndex: 'recordedBy',
      key: 'recordedBy',
      width: 150,
    },
  ];

  const downloadCSV = () => {
    const headers = ['Type', 'Date', 'Description', 'Amount (Rs.)', 'Recorded By', 'Remarks/Budget Head'];
    const csvRows = [headers.join(',')];

    combinedData.forEach((item) => {
      const row = [
        item.type === 'donation' ? 'Donation' : 'Expense',
        dayjs(item.date).format('YYYY-MM-DD'),
        item.type === 'donation' 
          ? `"${item.description}"`
          : `"${item.description} (${item.budgetHead})"`,
        item.type === 'expense' ? -item.amount : item.amount,
        item.recordedBy || 'N/A',
        item.type === 'donation' 
          ? (item.remarks || '-')
          : (item.budgetHead || '-')
      ];
      csvRows.push(row.map(cell => `"${cell}"`).join(','));
    });

    // Add summary rows
    csvRows.push([]);
    csvRows.push(['Total Donations', '', '', totalDonations, '', '']);
    csvRows.push(['Total Expenses', '', '', totalExpenses, '', '']);
    csvRows.push(['Net Amount', '', '', netAmount, '', '']);

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = fromDate && toDate
      ? `financial-report-${dayjs(fromDate).format('YYYY-MM-DD')}-to-${dayjs(toDate).format('YYYY-MM-DD')}.csv`
      : `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Financial Reports</h1>
            <p className="dashboard-subtitle">View combined donations and expenses reports</p>
          </div>

          {/* Filters */}
          <Card style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={8} md={6}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  From Date
                </label>
                <DatePicker
                  value={fromDate ? dayjs(fromDate) : null}
                  onChange={(date) => setFromDate(date ? date.toDate() : null)}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="From Date"
                />
              </Col>
              <Col xs={24} sm={8} md={6}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  To Date
                </label>
                <DatePicker
                  value={toDate ? dayjs(toDate) : null}
                  onChange={(date) => setToDate(date ? date.toDate() : null)}
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="To Date"
                />
              </Col>
              <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Button
                    type={activeFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setActiveFilter('all')}
                    size="large"
                  >
                    All
                  </Button>
                  <Button
                    type={activeFilter === 'donations' ? 'primary' : 'default'}
                    onClick={() => setActiveFilter('donations')}
                    size="large"
                    icon={<DollarOutlined />}
                  >
                    Donations Only
                  </Button>
                  <Button
                    type={activeFilter === 'expenses' ? 'primary' : 'default'}
                    onClick={() => setActiveFilter('expenses')}
                    size="large"
                    icon={<FileTextOutlined />}
                  >
                    Expenses Only
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleFilterChange}
                    disabled={!fromDate || !toDate}
                    size="large"
                    icon={<FilterOutlined />}
                  >
                    Apply Filter
                  </Button>
                  {(fromDate || toDate) && (
                    <Button onClick={handleClearFilter} size="large">
                      Clear
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Summary Statistics */}
          {combinedData.length > 0 && (
            <Row gutter={16} style={{ marginBottom: '1.5rem' }}>
              {(activeFilter === 'all' || activeFilter === 'donations') && combinedData.filter(item => item.type === 'donation').length > 0 && (
                <Col xs={24} sm={8}>
                  <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                    <Statistic
                      title="Total Donations"
                      value={totalDonations}
                      prefix="Rs."
                      valueStyle={{ color: '#52c41a' }}
                      suffix={
                        <Tag color="green">{combinedData.filter(item => item.type === 'donation').length} entries</Tag>
                      }
                    />
                  </Card>
                </Col>
              )}
              {(activeFilter === 'all' || activeFilter === 'expenses') && combinedData.filter(item => item.type === 'expense').length > 0 && (
                <Col xs={24} sm={8}>
                  <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                    <Statistic
                      title="Total Expenses"
                      value={totalExpenses}
                      prefix="Rs."
                      valueStyle={{ color: '#ff4d4f' }}
                      suffix={
                        <Tag color="red">{combinedData.filter(item => item.type === 'expense').length} entries</Tag>
                      }
                    />
                  </Card>
                </Col>
              )}
              {activeFilter === 'all' && combinedData.length > 0 && (
                <Col xs={24} sm={8}>
                  <Card style={{ borderRadius: 'var(--radius-xl)' }}>
                    <Statistic
                      title="Net Amount"
                      value={netAmount}
                      prefix="Rs."
                      valueStyle={{ 
                        color: netAmount >= 0 ? '#52c41a' : '#ff4d4f',
                        fontWeight: 600
                      }}
                    />
                  </Card>
                </Col>
              )}
            </Row>
          )}

          {/* Table View */}
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <TableOutlined />
                    Table View
                  </span>
                }
                key="table"
              >
                <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={downloadCSV}
                    disabled={combinedData.length === 0}
                  >
                    Download CSV
                  </Button>
                </div>

                <Table
                  columns={columns}
                  dataSource={combinedData}
                  loading={loading}
                  rowKey="key"
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} entries`,
                  }}
                  scroll={{ x: true }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Reports;

