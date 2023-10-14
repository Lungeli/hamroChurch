import { useEffect, useState } from "react";
import Header from '../../../components/Header';
import { Table, Button, Space, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
   
    fetch("http://localhost:4000/member")
      .then((response) => response.json())
      .then((data) => {
        // Add serial numbers to the member list
        const membersWithSN = data.memberList.map((member, index) => ({
          ...member,
          sn: index + 1,
        }));
        setMembers(membersWithSN);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEdit = (record) => {
    console.log("Edit:", record);
  };

  const handleDelete = (record) => {
    console.log("Delete:", record);
  };

  const handleView = (record) => {
    setSelectedMember(record);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Convert search query to lowercase
  };

  // Filter the data based on the search query
  const filteredMembers = members.filter((member) => {
    const { fullName, email, address } = member;
    return (
      fullName.toLowerCase().includes(searchQuery) ||
      email.toLowerCase().includes(searchQuery) ||
      address.toLowerCase().includes(searchQuery)
    );
  });

  const columns = [
    {
      title: "S.N.",
      dataIndex: "sn",
      key: "sn",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} members`,
  };

  return (
    <div>
    <Header/>
      <h1>Members</h1>
      <div style={{ display: "flex", marginBottom: 10, alignItems: "center" }}>
        <Input
          placeholder="Search members"
          onChange={handleSearch}
          value={searchQuery}
          style={{ width: 150 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="large"
          onClick={() => handleSearch}
          style={{ marginLeft: 10 }}
        >
          Search
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredMembers}
        pagination={paginationConfig}
      />
      <Modal
        title="User Details"
        visible={selectedMember !== null}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Close
          </Button>
        ]}
      >
        {selectedMember && (
          <div>
            <p><strong>Full Name:</strong> {selectedMember.fullName}</p>
            <p><strong>Email:</strong> {selectedMember.email}</p>
            <p><strong>Address:</strong> {selectedMember.address}</p>
            <p><strong>Phone Number:</strong> {selectedMember.phoneNumber}</p>
            <p><strong>Date of Birth:</strong> {selectedMember.dob}</p>
            <p><strong>Gender:</strong> {selectedMember.gender}</p>
            <p><strong>Marital Status:</strong> {selectedMember.maritalStatus}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MembersPage;