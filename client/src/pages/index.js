import React from 'react';
import { useRouter } from 'next/router';
import Heroimg from '../../public/assets/mirchaiya.png';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';

export default function Index() {
  const { isLoggedIn, userDetails } = useSelector((state) => state.users);
  const router = useRouter();

  // Check if the user is logged in, and if so, redirect to the /dashboard page
  React.useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${Heroimg.src})` }}>
        <div className="request--box">
          <p></p>
          <div className="btn">
            <a href="/login">Get Started</a>
          </div>
        </div>
      </section>
    </>
  );
}