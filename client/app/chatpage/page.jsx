'use client'
import React, {useState,useEffect, useRef} from 'react'
import Account from './components/Account';
import Displayfriends from './components/displayfriends';
import Addfriend from './components/addfriend';
import Chatbox from './components/chatbox';
import Image from 'next/image'
//import { useForm } from "react-hook-form"
//import axios from 'axios';
//import search from './addfriend';


const Page = () => {
   //const { register, handleSubmit } = useForm();
  
   const[me,setMe]=useState(null);
  const [Client,setClient]=useState(0); 
  const [User, setUser] = useState(null);
 const [Nav,setNav]=useState('1');
  const linkRef = useRef(null);

  useEffect(() => {
    setClient(1);
    setMe(JSON.parse(localStorage.getItem('user')))
    if (linkRef.current) {
      linkRef.current.focus();
    }
  }, []);

  const Sentmessage=(chatuser)=>{
    setUser(chatuser)
  }
  
  if(!Client) return null

  return (
    <aside class="flex py-[2%] px-[5%] bg-custom-background bg-cover bg-no-repeat h-screen">

<div class="flex flex-col items-center w-16 h-[90vh] py-8 space-y-8  bg-[#0b0d26] border-gray-700 rounded-lg">
        <a href="#">
            <Image width={500} height={300} class="w-auto h-6" src="https://merakiui.com/images/logo.svg" alt=""/>
        </a>

        <a href="#" ref={linkRef} class="p-1.5 focus:text-blue-500 focus:bg-gray-800 focus:outline-nones transition-colors duration-200 rounded-lg text-gray-400 hover:bg-gray-800" onClick={()=>setNav('1')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
        </a>

        <a href="#" class="p-1.5 focus:text-blue-500 focus:bg-gray-800 focus:outline-nones transition-colors duration-200 rounded-lg text-gray-400 hover:bg-gray-800"onClick={()=>setNav('2')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        </a>

        <a href="#" class="p-1.5  focus:bg-gray-800 focus:outline-nones transition-colors duration-200 rounded-lg hover:bg-gray-800" onClick={()=>setNav('3')} >
        <Image width={500} height={300} class="object-cover w-8 h-8 rounded-full" src={me.Profile}  alt=""/>
        </a>
    </div>
    
          {Nav === '1' && <Displayfriends activeUser={Sentmessage} user={me}/>}
          {Nav === '2' && <Addfriend  user={me}/>}
          {Nav === '3' && <Account user={me} />}
   
    <div class="hidden sm:flex  h-[90vh] py-6 px-4 overflow-y-auto  border-l rounded-lg border-r w-[65vw]  bg-gray-900 bg-opacity-50 backdrop-blur-sm border-gray-700">
        {Nav === '1' && <Chatbox chatUser={User} user={me}/>}
    </div>

</aside>
  )
}

export default Page