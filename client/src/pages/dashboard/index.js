import React from 'react'
import { useRouter } from 'next/navigation';
import { Button, Col, Row, Statistic } from 'antd';


import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';


const Dashboard = () => {
  const router = useRouter()

  const {userDetails} = useSelector(state=>state.users)
  const handleMember= () => {
    router.push('/members')
  }
    return(
      <>
        <Header/>
        <div>Welcome To Dashboard {userDetails.fullName}</div>
        <div style={{margin:'10px' ,backgroundColor:'lightgrey', padding:'5px', width:'200px'}}>
        <Row gutter={16} >
          <Col span={12}>
      <Statistic title="Active Users" value={112893} />
        </Col>
        </Row>
        </div>

        <div><br/> <br/> <button onClick={handleMember}>Add Member</button></div>
     
          </>
    
    )
  }

export default Dashboard;