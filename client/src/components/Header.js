import Image from 'next/image'
import Logo from '../../public/hamroChurchLogo.png'
import { Avatar, Space, Button, Popover } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { handleLogOut } from '@/redux/reducerSlice/users';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userLogOut = () =>{
    dispatch(handleLogOut())
    router.push('/login')
  }
  const {isLoggedIn, userDetails} = useSelector(state=>state.users)
  const content = (
    <div>
      <Link href='/profile'> Profile </Link>
      <p onClick={userLogOut}>Log Out</p>
    </div>
  );

  return (
   <header>
    <div className="container">
       <nav>
        <div className="logo">
           <a href='/'><Image src={Logo} alt="Picture of the author"/></a>
        </div>
        {isLoggedIn ? (
          <div>
             <Popover placement="top" title={userDetails.fullName} content={content} trigger="click">
             <Avatar
            style={{
               marginTop: '33px',
               marginRight: '10px',
               backgroundColor: '#fde3cf',
               color: '#f56a00',
               fontSize:'1.5rem'
            }}
          >
           {userDetails.fullName[0]}
          </Avatar>
         
        
      </Popover>
          
          </div>
         
        ):(
          <ul className="nav-menus">
          <li><a className="active" href="/login">Login</a></li>
          <li><a className="active" href="/register">Signup</a></li>
      </ul>
        )}
        
        
       </nav>
    </div>
        
    </header>
    
  )
}