import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Image from 'next/image'

const Chats = ({ activeUser , user }) => {
  const [Users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
      const response = await axios.post("http://localhost:8000/displayusers",user);
        const chat=response.data;
        setUsers(chat);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };
    fetchUsers();
  }, []);

 const openChat=(chatUser)=>{
    activeUser(chatUser)
 }

 
  
  return (
    <div class="h-[90vh] py-6 px-4 overflow-y-auto  border-l rounded-lg border-r w-full sm:w-[20vw]  bg-[#0b0d26] border-gray-700">
      <h2 class="px-5 pb-2 text-lg items-center border-b mb-4 font-medium text-white">Chats</h2>
      <div class="mt-4 space-y-2">
      {Users.length > 0 && (
    <div>
    {Users.map((Users, index) => (<button key={index} class="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-800 gap-x-2  focus:outline-none" onClick={() => openChat(Users)}>
          <Image width={500} height={300} class="object-cover w-8 h-8 rounded-full" src={Users.Profile} alt=""/>
          <h1 class="text-sm font-medium text-white">{Users.Username}</h1>
      </button> ))}
  </div>
)}
  </div>
    </div>
  )
}

export default Chats
