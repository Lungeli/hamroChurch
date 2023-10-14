import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Col, Row, Statistic } from 'antd';

import { UserAddOutlined, UnorderedListOutlined, DollarCircleOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { Progress, Space } from 'antd';


const Dashboard = () => {
  const router = useRouter()
  const [totalCount, setTotalCount] = useState(0)
  const [totalDonation, setTotalDonation] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);


  const fetchMaleCount = async() =>{
    const res = await fetch(`http://localhost:4000/male-count`)
    const data = await res.json()
    setMaleCount(data.maleCount);

  }
  const fetchFemaleCount = async() =>{
    const res = await fetch(`http://localhost:4000/female-count`)
    const data = await res.json()
    setFemaleCount(data.femaleCount);

  }


  const fetchMembersDetails = async(page=1, size=10) => {
    const res = await fetch(`http://localhost:4000/member`)
    const data = await res.json()
    console.log(data)
 
    setTotalCount(data.count)
}
const fetchDonationSum = async(page=1, size=10) => {
  const res = await fetch(`http://localhost:4000/donation-amount`)
  const data = await res.json()
  console.log(data)

  setTotalDonation(data.totalDonation);
}
useEffect(()=>{
    fetchMembersDetails()
    fetchDonationSum()
    fetchMaleCount()
    fetchFemaleCount()
},[])
  const {userDetails} = useSelector(state=>state.users)
  const handleMember= () => {
    router.push('/members')
  }
  const viewMember= () => {
    router.push('/members/view-member')
  }
  const handleDonation= () => {
    router.push('/donation')
  }
  const handleDonationReport= () => {
    router.push('/donation-report')
  }
  const handleEvent= () => {
    router.push('/event')
  }
  return (
    <>
      <Header />
      <div
        style={{
          margin: '10px',
          backgroundColor: 'lightgrey',
          padding: '15px',
          borderRadius: '10px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h2>Welcome To Dashboard</h2>
        <h3>{userDetails.fullName}</h3>
      </div>

      <Row gutter={16} style={{ margin: '20px' }}>
      <Col span={12}>
          <div style={{ padding: '10px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Total Members" value={totalCount} />
              </Col>
              <Col span={12}>
                <Statistic title="Total Donation" value={totalDonation} />
              </Col>
            </Row>
      
            <Progress type="circle" percent={maleCount} format={(percent) => `${percent} Male`} />
            <Progress type="circle" percent={femaleCount} format={(percent) => `${percent} Female`} />
            <Progress type="circle" percent={100} format={() => `${totalCount} Total Members`} />
          </div>
        </Col>
      </Row>

      <Row gutter={16} style={{ margin: '20px' }}>
        <Col span={12}>
          <div style={{ padding: '10px' }}>
            <Button type="primary" onClick={handleMember} style={{ margin: '5px' }}>
              <UserAddOutlined /> Add Member
            </Button>
            <Button type="primary" onClick={viewMember} style={{ margin: '5px' }}>
              <UnorderedListOutlined /> View All Members
            </Button>
            <Button type="primary" onClick={handleDonation} style={{ margin: '5px' }}>
              <DollarCircleOutlined /> Add Donation
            </Button>
            <Button type="primary" onClick={handleDonationReport} style={{ margin: '5px' }}>
              <FileTextOutlined /> Generate Donation Report
            </Button>
            <Button type="primary" onClick={handleEvent} style={{ margin: '5px' }}>
              <CalendarOutlined /> View Events
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
