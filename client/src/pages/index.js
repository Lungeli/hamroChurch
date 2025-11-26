import React from 'react';
import { useRouter } from 'next/router';
import Heroimg from '../../public/assets/mirchaiya.PNG';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import Button from '@/components/Button';
import { ArrowRightOutlined } from '@ant-design/icons';

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
    <div className="landing-page" style={{ backgroundImage: `url(${Heroimg.src})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh' }}>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to RTN FG Church</h1>
          <p className="hero-subtitle">
            Your comprehensive church management solution. Manage members, track donations,
            plan events, and build a stronger community together.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => router.push('/login')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              Get Started
              <ArrowRightOutlined style={{ marginLeft: '0.5rem' }} />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/register')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
              }}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
