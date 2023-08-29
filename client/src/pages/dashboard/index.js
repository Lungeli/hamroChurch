import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Col, Row, Statistic } from 'antd';


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
    return(
      <>
        <Header/>
        <div>Welcome To Dashboard {userDetails.fullName}</div>
        <div style={{margin:'10px' ,backgroundColor:'lightgrey', padding:'5px', width:'200px'}}>
        <Row gutter={16} >
          <Col span={12}>
      <Statistic title="Total Members" value={totalCount} />
        </Col>
        <Col span={12}>
        <Statistic title="Total Donation" value={totalDonation} />
        </Col>
    
      
  
        </Row>
        </div>
        <div>
        <Progress type="circle" percent={maleCount} format={(percent) => `${percent} Male`} />
        <Progress type="circle" percent={femaleCount} format={(percent) => `${percent} Female`} />
        <Progress type="circle" percent={100} format={() =>  `${totalCount} Total Members`} />
        </div>

        <div><br/> <br/> <button onClick={handleMember}>Add Member</button>
        <button onClick={viewMember}>View All Member</button>
        <button onClick={handleDonation}>Add Donation</button>
        </div>
     
          </>
    
    )
  }

export default Dashboard;