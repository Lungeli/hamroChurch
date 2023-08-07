import React from 'react'

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';


const Dashboard = () => {
  const {userDetails} = useSelector(state=>state.users)
    return(
      <>
        <Header/>
        <div>Welcome To Dashboard {userDetails.fullName}</div>
          
    <Footer/>
    </>
    )
  }

export default Dashboard;