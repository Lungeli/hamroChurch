import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Col, Row, Statistic } from 'antd';


import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';


const Dashboard = () => {
  const router = useRouter()
  const [totalCount, setTotalCount] = useState(0)
  const fetchMembersDetails = async(page=1, size=10) => {
    const res = await fetch(`http://localhost:4000/member`)
    const data = await res.json()
    console.log(data)
 
    setTotalCount(data.count)
}
useEffect(()=>{
    fetchMembersDetails()
},[])
  const {userDetails} = useSelector(state=>state.users)
  const handleMember= () => {
    router.push('/members')
  }
  const viewMember= () => {
    router.push('/members/view-member')
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
        </Row>
        </div>

        <div><br/> <br/> <button onClick={handleMember}>Add Member</button>
        <button onClick={viewMember}>View All Member</button>
        </div>
     
          </>
    
    )
  }

export default Dashboard;