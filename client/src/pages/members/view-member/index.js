import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Table, Button, Space, Modal, Input, Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/member')
      .then((response) => response.json())
      .then((data) => {
        const membersWithSN = data.memberList.map((member, index) => ({
          ...member,
          key: member._id,
          sn: index + 1,
        }));
        setMembers(membersWithSN);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (record) => {
    console.log('Edit:', record);
    // TODO: Implement edit functionality
  };

  const handleDelete = (record) => {
    console.log('Delete:', record);
    // TODO: Implement delete functionality
  };

  const handleView = (record) => {
    setSelectedMember(record);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const filteredMembers = members.filter((member) => {
    const { fullName, email, address } = member;
    const query = searchQuery.toLowerCase();
    return (
      fullName?.toLowerCase().includes(query) ||
      email?.toLowerCase().includes(query) ||
      address?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      title: 'S.N.',
      dataIndex: 'sn',
      key: 'sn',
      width: 80,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">All Members</h1>
            <p className="dashboard-subtitle">View and manage church members</p>
          </div>

          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <Input
                placeholder="Search by name, email, or address"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: '400px', flex: 1 }}
                size="large"
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredMembers}
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} members`,
                pageSize: 10,
              }}
            />
          </Card>

          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserOutlined />
                <span>Member Details</span>
              </div>
            }
            open={selectedMember !== null}
            onCancel={closeModal}
            footer={[
              <Button key="close" onClick={closeModal}>
                Close
              </Button>
            ]}
            width={600}
          >
            {selectedMember && (
              <div style={{ padding: '1rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong>Full Name:</strong>
                    <p>{selectedMember.fullName}</p>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <p>{selectedMember.email || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Phone Number:</strong>
                    <p>{selectedMember.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Gender:</strong>
                    <p>{selectedMember.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Date of Birth:</strong>
                    <p>{selectedMember.dob || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Marital Status:</strong>
                    <p>{selectedMember.maritalStatus || 'N/A'}</p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Address:</strong>
                    <p>{selectedMember.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MembersPage;
