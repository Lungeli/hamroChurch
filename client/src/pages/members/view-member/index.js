import { useEffect, useState } from "react";
import { Table, Button, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Fetch data from your API endpoint
    fetch("http://localhost:4000/member")
      .then((response) => response.json())
      .then((data) => {
        setMembers(data.memberList);
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

  const columns = [
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

  return (
    <div>
      <h1>Members</h1>
      <Table columns={columns} dataSource={members} />

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
            {/* Add more fields as needed */}
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