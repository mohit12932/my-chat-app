'use client'
import React, {useState } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios';
import Image from 'next/image'

const Addfriend = ({user}) => {
    const { register, handleSubmit,setError,clearErrors,setValue,formState: { errors}} = useForm();
    const [Friend, setFriend] = useState(null);

  const addFriend=async()=>{
      let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/adduser/add`,{user,Friend} );
      if(response.status==201){
        alert("Added Successfully")}
        window.location.reload();
  }

      const onSubmit = async (data)=> {
               try {
                data.user=user.Username;
                let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/adduser`, data);
                let result = response.data;
                console.log(result)
                setFriend(result)
            } catch (error) {
                if (error.response && error.response.status === 409) {
                  setError("NoUser", { message: error.response.data.error });
                } else {
                    console.error(error);
                    alert('An unexpected error occurred');
                }
            }
            }

  return (
    <div class="h-[90vh] py-6 px-4 overflow-y-auto  border-l rounded-lg border-r w-full sm:w-[20vw]  bg-[#0b0d26] border-gray-700">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex items-center mt-5">
                <span className="absolute px-2 py-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="#FFFFFF" fill="none">
    <path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
                </span>

            <input type="text" {...register("Friends")} 
             onChange={(e) => {  clearErrors('NoUser')
              setValue('Friends', e.target.value);
            }} 
            className="block w-full py-0.5 px-11 bg-gray-800 border rounded-lg hover:bg-gray-700" placeholder="Search..."/>
            </div>
        </form>

        {errors.NoUser && <p className="text-sm  mt-2 text-center text-red-400">{errors.NoUser.message}</p>}

         {Friend && !errors.NoUser &&(
          <div class="flex mt-2">
         <div  class="flex items-center w-full px-5 py-2 transition-colors duration-200 hover:bg-gray-800 gap-x-2  focus:outline-none">
          <Image width={500} height={300} class="object-cover w-8 h-8 rounded-full" src={Friend.Profile} alt=""/>
          <h1 class="text-sm font-medium text-white">{Friend.Username}</h1>
         </div>
        <button class="px-3 hover:border rounded-full" onClick={addFriend}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
    <path d="M12 7.5C12 9.433 10.433 11 8.5 11C6.567 11 5 9.433 5 7.5C5 5.567 6.567 4 8.5 4C10.433 4 12 5.567 12 7.5Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M13.5 11C15.433 11 17 9.433 17 7.5C17 5.567 15.433 4 13.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M13.1429 20H3.85714C2.83147 20 2 19.2325 2 18.2857C2 15.9188 4.07868 14 6.64286 14H10.3571C11.4023 14 12.3669 14.3188 13.1429 14.8568" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M19 14V20M22 17L16 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    </button>
    </div>)}



    </div>
  )
}

export default Addfriend
