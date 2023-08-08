import React from 'react'
import { useRouter } from 'next/navigation';


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
        <div> <button onClick={handleMember}>Add Member</button></div>

          </>
    
    )
  }

export default Dashboard;