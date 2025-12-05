import React, { useState, useEffect } from 'react';
import { Card, Table, Button, InputNumber, message, Space, Tag, Alert } from 'antd';
import { SaveOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const BudgetSettings = () => {
  const router = useRouter();
  const { userDetails } = useSelector(state => state.users);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    fetchBudgetSettings();
  }, []);

  useEffect(() => {
    const total = budgetHeads.reduce((sum, head) => sum + (head.percentage || 0), 0);
    setTotalPercentage(total);
  }, [budgetHeads]);

  const fetchBudgetSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/budget-settings');
      const data = await res.json();
      
      if (data.settings && data.settings.budgetHeads) {
        setBudgetHeads(data.settings.budgetHeads);
      }
    } catch (error) {
      console.error('Error fetching budget settings:', error);
      messageApi.error('Failed to fetch budget settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePercentageChange = (index, value) => {
    const updated = [...budgetHeads];
    updated[index].percentage = value || 0;
    setBudgetHeads(updated);
  };

  const handleSave = async () => {
    if (Math.abs(totalPercentage - 100) > 0.01) {
      messageApi.error(`Total percentage must equal 100%. Current total: ${totalPercentage.toFixed(2)}%`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('http://localhost:4000/budget-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetHeads,
          updatedBy: userDetails?.fullName || 'Admin'
        })
      });

      const data = await res.json();
      
      if (data.settings) {
        messageApi.success('Budget settings updated successfully!');
        fetchBudgetSettings();
      } else {
        messageApi.error(data.error || 'Failed to update budget settings');
      }
    } catch (error) {
      console.error('Error saving budget settings:', error);
      messageApi.error('Failed to save budget settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:4000/budget-settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updatedBy: userDetails?.fullName || 'Admin'
        })
      });

      const data = await res.json();
      
      if (data.settings) {
        messageApi.success('Budget settings reset to default!');
        fetchBudgetSettings();
      } else {
        messageApi.error('Failed to reset budget settings');
      }
    } catch (error) {
      console.error('Error resetting budget settings:', error);
      messageApi.error('Failed to reset budget settings');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Budget Head',
      dataIndex: 'headName',
      key: 'headName',
      width: '60%',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Percentage (%)',
      key: 'percentage',
      width: '40%',
      render: (_, record, index) => (
        <InputNumber
          min={0}
          max={100}
          step={0.1}
          value={record.percentage}
          onChange={(value) => handlePercentageChange(index, value)}
          style={{ width: '100%' }}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
        />
      )
    }
  ];

  return (
    <>
      {contextHolder}
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Budget Head Settings</h1>
            <p className="dashboard-subtitle">Configure budget allocation percentages</p>
          </div>

          <Card 
            style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}
            extra={
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  loading={saving}
                >
                  Reset to Default
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saving}
                  disabled={Math.abs(totalPercentage - 100) > 0.01}
                >
                  Save Settings
                </Button>
              </Space>
            }
          >
            {Math.abs(totalPercentage - 100) > 0.01 && (
              <Alert
                message={`Total percentage: ${totalPercentage.toFixed(2)}%`}
                description="The total percentage must equal exactly 100% to save."
                type="warning"
                showIcon
                style={{ marginBottom: '1rem' }}
              />
            )}

            {Math.abs(totalPercentage - 100) <= 0.01 && (
              <Alert
                message={`Total percentage: ${totalPercentage.toFixed(2)}%`}
                description="All percentages are correctly configured."
                type="success"
                showIcon
                style={{ marginBottom: '1rem' }}
              />
            )}

            <Table
              columns={columns}
              dataSource={budgetHeads}
              rowKey="headName"
              loading={loading}
              pagination={false}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Tag color={Math.abs(totalPercentage - 100) <= 0.01 ? 'success' : 'error'}>
                        {totalPercentage.toFixed(2)}%
                      </Tag>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>

          <Card 
            title={
              <Space>
                <SettingOutlined />
                <span>Instructions</span>
              </Space>
            }
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Adjust the percentage for each budget head as needed</li>
              <li>The total of all percentages must equal exactly 100%</li>
              <li>These percentages will be used for all future budget allocations</li>
              <li>Existing budgets will not be affected by these changes</li>
              <li>Click "Reset to Default" to restore the original percentages</li>
            </ul>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BudgetSettings;



