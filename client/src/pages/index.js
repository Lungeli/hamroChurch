import React from 'react'
import Heroimg from '../../public/assets/mirchaiyaChurch.jpg'
import Footer from '../components/Footer'
export default function index() {
  return (
    <>
        <section className='hero' style={{backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(122, 189, 31, 0.73)),url(${Heroimg.src})`}}>
          <div className='container'>
            <div className='request--box'>
              <h2>Welcome to Hamro Church</h2> 
              <p></p>
                <div className='btn'>
                  
                  <a href='/login' >Get Started</a>
                </div>
            </div>
          </div>
        </section>
     </>
  )
client/src/styles/globals.css}