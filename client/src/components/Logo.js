import Image from 'next/image'
import React from 'react'
import Logo from '../../public/assets/police.png'
export const CustomLogo=()=> {
  return (
    <div>
           <Image src={Logo} alt="Picture of the author"/>
    </div>
  )
}