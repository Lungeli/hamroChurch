import React from 'react'
import Heroimg from '../../public/assets/logo.jpeg'
import Header from '@/components/Header'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
export default function index() {

  const {isLoggedIn, userDetails} = useSelector(state=>state.users)
  return (
    <>
        <Header/>
        <section className='hero' style={{backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(122, 189, 31, 0.73)),url(${Heroimg.src})`}}>
        
            <div className='request--box'> 
              <p></p>
              {isLoggedIn ? (
                <div className='btn'>
                  
                  <a href='/dashboard' >Get Started</a>
                </div>
              ) : (
                <div className='btn'>
                  
                <a href='/login' >Get Started</a>
              </div>
              )}
            </div>
          
        </section>
        <Footer/>
     
     </>
  )
client/src/styles/globals.css}