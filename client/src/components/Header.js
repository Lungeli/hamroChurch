import Image from 'next/image'
import Logo from '../../public/hamroChurchLogo.png'
import { Avatar, Space } from 'antd';
export default function Header() {
  return (
   <header>
    <div className="container">
       <nav>
        <div className="logo">
           <a href='/'><Image src={Logo} alt="Picture of the author"/></a>
        </div>
        <ul className="nav-menus">
            <li><a href="/login">Login</a></li>
            <li><a className="active" href="/register">Signup</a></li>
        </ul>
        <Avatar
      style={{
         marginTop: '33px',
         marginRight: '10px',
         backgroundColor: '#fde3cf',
         color: '#f56a00',
         fontSize:'1.5rem'
      }}
    >
      U
    </Avatar>
       </nav>
    </div>
        
    </header>
    
  )
}
