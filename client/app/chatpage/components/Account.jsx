import React from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Account = ({user}) => {
    const router = useRouter();

    const clear=()=>{
        localStorage.clear();
        router.push('../Homepage/SignIn');
    }

  return (
    <div className="h-[90vh] py-6 px-4 overflow-y-auto  border-l rounded-lg border-r w-full sm:w-[20vw]  bg-[#0b0d26] border-gray-700">
         <h2 className="px-5 pb-2 text-lg text-center items-center border-b my-4 font-medium text-white">Profile</h2>
        <div className="flex flex-col items-center my-[30%] -mx-2">
        <Image width={500} height={300} className="object-cover w-24 h-24 mx-2 rounded-full" src={user.Profile} alt="avatar"/>
        <h4 className="mx-2 mt-4 font-medium text-gray-200">{user.Username}</h4>
        <p className="mx-2 mt-2 text-sm font-medium text-gray-400">{user.emailadress}</p>
        <button className="p-2.5 mx-2 mt-16 bg-gray-800 hover:bg-gray-600 rounded-lg " onClick={clear}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
    <path d="M7.02331 5.5C4.59826 7.11238 3 9.86954 3 13C3 17.9706 7.02944 22 12 22C16.9706 22 21 17.9706 21 13C21 9.86954 19.4017 7.11238 16.9767 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        </button>
        <span className="mt-2">Logout</span>
    </div>
    </div>
  )
}

export default Account
