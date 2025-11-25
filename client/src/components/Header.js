import Image from 'next/image';
import Logo from '../../public/hamroChurchLogo.png';
import { Avatar, Space, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { handleLogOut } from '@/redux/reducerSlice/users';
import { useRouter } from 'next/router';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, userDetails } = useSelector(state => state.users);

  const userLogOut = () => {
    dispatch(handleLogOut());
    router.push('/login');
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
      <Link
        href='/profile'
        style={{
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <UserOutlined />
        Profile
      </Link>
      <div
        onClick={userLogOut}
        style={{
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'background-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <LogoutOutlined />
        Log Out
      </div>
    </div>
  );

  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">
            <Link href="/">
              <Image
                src={Logo}
                alt="Hamro Church Logo"
                style={{ cursor: 'pointer' }}
                priority
              />
            </Link>
          </div>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Popover
                placement="bottomRight"
                title={
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {userDetails?.fullName || 'User'}
                  </div>
                }
                content={content}
                trigger="click"
              >
                <Avatar
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#fde3cf',
                    color: '#f56a00',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    transition: 'transform var(--transition-base)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {userDetails?.fullName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </Popover>
            </div>
          ) : (
            <ul className="nav-menus">
              <li>
                <Link href="/login" className="active">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="active">
                  Signup
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}
