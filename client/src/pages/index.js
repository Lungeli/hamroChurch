import React from 'react'
import Heroimg from '../../public/assets/mirchaiya.png'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
export default function index() {

  const {isLoggedIn, userDetails} = useSelector(state=>state.users)
  return (
    <>
        <section className='hero' style={{backgroundImage: `url(${Heroimg.src})`}}>
        
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
     </>
  )
client/src/styles/globals.css}