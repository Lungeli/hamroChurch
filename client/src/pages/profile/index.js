import { Card, Space, Modal } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';




const Profile = () => {
  const {userDetails} = useSelector(state=>state.users)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = () =>
  {
    alert("Submit to Backend")
  }


  return(
    <>

     <Card title="Your Profile">
    
    <Card type="inner" title="User Details" extra={<a href="#">Edit</a>}>
      Full Name: {userDetails.fullName} <br/>
      Email: {userDetails.email} <br/>
      Phone Number: {userDetails.phoneNumber} <br/>
      Mode: {userDetails.mode} <br/>
  
    </Card>
    <Card
      style={{
        marginTop: 16,
      }}
      type="inner"
      title="Account Settings"
      extra={<a href="#">More</a>}
    >
     <span onClick={()=>setIsModalOpen(true)}> Change Password </span>  <br/>
     Delete Account: <br/>
    </Card>
    <Modal title="Basic Modal" open={isModalOpen} onOk={handleSubmit} onCancel={()=>setIsModalOpen(false)}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
  </Card>
    </>
 
)};

export default Profile;