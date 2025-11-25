import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, Spin, Alert, Button, Select, Space, Table, Tabs, Tag, Statistic, Row, Col } from 'antd';
import { FileTextOutlined, DownloadOutlined, FilterOutlined, TableOutlined, FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

const DonationReport = () => {
  const [pdfSrc, setPdfSrc] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('table');

  // Generate month and year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const fetchDonations = async (month = null, year = null) => {
    try {
      setTableLoading(true);
      let url = 'http://localhost:4000/donations';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      
      const data = await response.json();
      setDonations(data.donations || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donations. Please try again.');
    } finally {
      setTableLoading(false);
    }
  };

  const fetchPdfReport = async (month = null, year = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = 'http://localhost:4000/generate-donation-report';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const blob = await response.blob();
      const urlObject = URL.createObjectURL(blob);
      
      // Revoke previous URL if exists
      if (pdfSrc) {
        URL.revokeObjectURL(pdfSrc);
      }
      
      setPdfSrc(urlObject);
    } catch (error) {
      console.error('Error fetching PDF report:', error);
      setError('Failed to load donation report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    if (selectedMonth && selectedYear) {
      fetchDonations(selectedMonth, selectedYear);
      fetchPdfReport(selectedMonth, selectedYear);
    } else {
      fetchDonations();
      fetchPdfReport();
    }
  };

  const handleClearFilter = () => {
    setSelectedMonth(null);
    setSelectedYear(new Date().getFullYear());
    fetchDonations();
    fetchPdfReport();
  };

  const downloadCSV = () => {
    // Group by month for CSV
    const groupedByMonth = {};
    donations.forEach((donation) => {
      const monthKey = dayjs(donation.donationDate).format('YYYY-MM');
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = [];
      }
      groupedByMonth[monthKey].push(donation);
    });

    const headers = ['S.N.', 'Offering Date', 'Amount (Rs.)', 'Type', 'Entered By', 'Remarks', 'Recorded Date'];
    let csvRows = [];
    let globalIndex = 1;

    Object.keys(groupedByMonth).sort().forEach((monthKey) => {
      const monthDonations = groupedByMonth[monthKey];
      const monthName = dayjs(monthKey).format('MMMM YYYY');
      csvRows.push([`=== ${monthName} ===`]);
      
      monthDonations.forEach((donation) => {
        csvRows.push([
          globalIndex++,
          dayjs(donation.donationDate).format('YYYY-MM-DD'),
          donation.donationAmount,
          donation.donationType || 'General Offering',
          donation.user || 'N/A',
          donation.remarks || 'N/A',
          donation.recordedDate ? dayjs(donation.recordedDate).format('YYYY-MM-DD HH:mm') : dayjs(donation.createdAt).format('YYYY-MM-DD HH:mm')
        ]);
      });
      
      const monthTotal = monthDonations.reduce((sum, d) => sum + (d.donationAmount || 0), 0);
      csvRows.push([`Total for ${monthName}: Rs. ${monthTotal}`]);
      csvRows.push([]); // Empty row between months
    });

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = selectedMonth && selectedYear
      ? `offerings-report-${months.find(m => m.value === selectedMonth)?.label}-${selectedYear}.csv`
      : `offerings-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchDonations();
    fetchPdfReport();
    
    // Cleanup function to revoke object URL
    return () => {
      if (pdfSrc) {
        URL.revokeObjectURL(pdfSrc);
      }
    };
  }, []);

  const totalAmount = donations.reduce((sum, donation) => sum + (donation.donationAmount || 0), 0);
  const totalCount = donations.length;

  // Group donations by month
  const groupedByMonth = {};
  donations.forEach((donation) => {
    const monthKey = dayjs(donation.donationDate).format('YYYY-MM');
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(donation);
  });

  // Create data source with month headers
  const tableData = [];
  Object.keys(groupedByMonth).sort().forEach((monthKey) => {
    const monthDonations = groupedByMonth[monthKey];
    const monthName = dayjs(monthKey).format('MMMM YYYY');
    const monthTotal = monthDonations.reduce((sum, d) => sum + (d.donationAmount || 0), 0);
    
    // Add month header row
    tableData.push({
      key: `month-${monthKey}`,
      isMonthHeader: true,
      monthName: monthName,
      monthTotal: monthTotal,
      monthCount: monthDonations.length,
    });
    
    // Add donation rows for this month
    monthDonations.forEach((donation, index) => {
      tableData.push({
        ...donation,
        key: donation._id,
        isMonthHeader: false,
        monthKey: monthKey,
      });
    });
  });

  const columns = [
    {
      title: 'S.N.',
      key: 'index',
      width: 80,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Offering Date',
      dataIndex: 'donationDate',
      key: 'donationDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => new Date(a.donationDate) - new Date(b.donationDate),
    },
    {
      title: 'Amount (Rs.)',
      dataIndex: 'donationAmount',
      key: 'donationAmount',
      render: (amount) => `Rs. ${amount?.toLocaleString() || 0}`,
      sorter: (a, b) => (a.donationAmount || 0) - (b.donationAmount || 0),
    },
    {
      title: 'Type',
      dataIndex: 'donationType',
      key: 'donationType',
      render: (type) => {
        const colorMap = {
          'Tithe': 'blue',
          'General Offering': 'green',
          'Special Offering': 'purple',
        };
        return <Tag color={colorMap[type] || 'default'}>{type || 'General Offering'}</Tag>;
      },
      filters: [
        { text: 'Tithe', value: 'Tithe' },
        { text: 'General Offering', value: 'General Offering' },
        { text: 'Special Offering', value: 'Special Offering' },
      ],
      onFilter: (value, record) => record.donationType === value,
    },
    {
      title: 'Entered By',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (remarks) => remarks || '-',
      ellipsis: true,
    },
    {
      title: 'Recorded Date',
      dataIndex: 'recordedDate',
      key: 'recordedDate',
      render: (date, record) => date 
        ? dayjs(date).format('YYYY-MM-DD HH:mm')
        : dayjs(record.createdAt).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Offerings Collection Report</h1>
            <p className="dashboard-subtitle">View and download offerings collection reports</p>
          </div>

          <Card
            style={{
              marginBottom: '1.5rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <Space size="large" wrap>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FilterOutlined />
                <span style={{ fontWeight: 600 }}>Filter by Month:</span>
              </div>
              <Select
                placeholder="Select Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: 150 }}
                allowClear
              >
                {months.map(month => (
                  <Option key={month.value} value={month.value}>
                    {month.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Select Year"
                value={selectedYear}
                onChange={setSelectedYear}
                style={{ width: 120 }}
              >
                {years.map(year => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                onClick={handleFilterChange}
                disabled={!selectedMonth || !selectedYear}
              >
                Apply Filter
              </Button>
              {(selectedMonth || selectedYear !== new Date().getFullYear()) && (
                <Button onClick={handleClearFilter}>
                  Clear Filter
                </Button>
              )}
            </Space>
          </Card>

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
                <div style={{ marginBottom: '1.5rem' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Total Offerings"
                          value={totalCount}
                          prefix={<FileTextOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Statistic
                          title="Total Amount"
                          value={totalAmount}
                          prefix="Rs."
                          valueStyle={{ color: '#10b981' }}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={downloadCSV}
                          disabled={donations.length === 0}
                          block
                        >
                          Download CSV
                        </Button>
                      </Card>
                    </Col>
                  </Row>
                </div>

                <Table
                  columns={columns}
                  dataSource={tableData}
                  loading={tableLoading}
                  rowKey="key"
                  pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entries`,
                    pageSize: 20,
                  }}
                  scroll={{ x: 'max-content' }}
                  components={{
                    body: {
                      row: (props) => {
                        const { children, ...restProps } = props;
                        // Find the record by matching the row key
                        const rowKey = restProps['data-row-key'] || restProps['data-row-key'];
                        const record = tableData.find(d => String(d.key) === String(rowKey));
                        
                        if (record?.isMonthHeader) {
                          return (
                            <tr {...restProps} style={{ backgroundColor: 'var(--gray-100)', fontWeight: 600 }}>
                              <td colSpan={columns.length} style={{ padding: '1rem', fontSize: '1.1rem' }}>
                                <Space>
                                  <span>{record.monthName}</span>
                                  <Tag color="blue">{record.monthCount} offerings</Tag>
                                  <Tag color="green">Total: Rs. {record.monthTotal.toLocaleString()}</Tag>
                                </Space>
                              </td>
                            </tr>
                          );
                        }
                        return <tr {...restProps}>{children}</tr>;
                      },
                    },
                  }}
                  onRow={(record) => {
                    return {
                      'data-row-key': record.key,
                    };
                  }}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <FilePdfOutlined />
                    PDF View
                  </span>
                }
                key="pdf"
              >
                {loading && (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                      Generating report...
                    </p>
                  </div>
                )}

                {error && (
                  <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ width: '100%', marginBottom: '1rem' }}
                  />
                )}

                {pdfSrc && !loading && (
                  <div style={{ width: '100%', height: '100%' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = pdfSrc;
                          const fileName = selectedMonth && selectedYear
                            ? `offerings-report-${months.find(m => m.value === selectedMonth)?.label}-${selectedYear}.pdf`
                            : `offerings-report-${new Date().toISOString().split('T')[0]}.pdf`;
                          link.download = fileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Download PDF
                      </Button>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 'calc(100vh - 400px)',
                        minHeight: '600px',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <iframe
                        src={pdfSrc}
                        title="Donation Report"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}

                {!pdfSrc && !loading && !error && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <FileTextOutlined style={{ fontSize: '4rem', marginBottom: '1rem' }} />
                    <p>No report available</p>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonationReport;
