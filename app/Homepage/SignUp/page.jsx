"use client"
import React, {useState} from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Avatar from 'react-avatar';

export default function page(){
    const router = useRouter();
    const { register, handleSubmit,watch,setError,clearErrors, formState: { errors,isSubmitting } } = useForm();

        const Password=watch('Password')

    const onSubmit = async (data)=> {

        if(data.Profile[0]){
        const imgData = new FormData();
        imgData.append('file', data.Profile[0]);
        imgData.append('upload_preset', 'chat-app');

         const res = await axios.post(`https://api.cloudinary.com/v1_1/deiyquzr6/image/upload`, imgData);
             const imageURL = res.data.secure_url;
                data.Profile=imageURL;
                }
        else{ delete data.Profile; }
           
        try{ let response = await axios.post("http://localhost:8000/signup",data);
             if(response.status==201){
                alert('User registered successfully!');
                router.push('./SignIn');
             }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setError("existUser", { message: error.response.data.error });
                } else {
                    console.error(error);
                    alert('An unexpected error occurred');
                }
            }

    }

  return (
    <div className="bg-custom-background bg-cover bg-no-repeat h-screen flex justify-center items-center">
      <div className="w-full h-auto max-w-72 sm:max-w-sm py-4 sm:py-10 sm:px-6  mx-auto backdrop-blur-3xl border rounded-lg shadow-lg">
    <div className="container flex items-baseline justify-center h-auto px-6 mx-auto">
        <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}  encType="multipart/form-data">
            <div className="flex justify-center mx-auto">
                <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt=""/>
            </div>
            
            <div className="flex items-center justify-center mt-6">
                <a href="./SignIn" className="w-1/3 pb-2 font-medium text-center capitalize border-b">
                    Sign in
                </a>

                <a href="#" className="w-1/3 pb-2 font-medium text-center capitalize border-b-2 border-blue-500">
                    Sign up
                </a>
            </div>
            
             {errors.existUser && <p className="text-sm  mt-2 text-center text-red-400">{errors.existUser.message}</p>}
    
             <Avatar alt="Remy Sharp" src="" />

            <div className="relative flex items-center mt-5">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </span>

                <input type="text" {...register("Username", { required:'Username is required' })} 
                 onChange={() => clearErrors('existUser')}
                  className="block w-full py-1 bg-transparent border rounded-lg px-11 focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 " placeholder="Username" />
            </div>
            {errors.Username && <p className="text-sm text-red-400">{errors.Username.message}</p>}

            <label for="dropzone-file" className="flex items-center px-3 py-1 mx-auto mt-4 text-center bg-transparent border border-dashed rounded-lg cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>

                <h2 className="mx-3 text-gray-400">Profile Photo</h2>

                <input id="dropzone-file" {...register("Profile",{
                        validate: {
                            fileSize: (value) => {
                                if (value && value[0]) {
                                    return value[0].size <= 2 * 1024 * 1024 || 'File size exceeds 2MB';
                                }
                                return true;
                            }
                        }
                    })}  type="file"  className="hidden" accept='image/*'/>
            </label>
            {errors.Profile && <p className="text-red-400">{errors.Profile.message}</p>}

            <div className="relative flex items-center mt-4">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </span>

                <input type="email" {...register("emailadress", {  required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address'},
            })} 
            onChange={() => clearErrors('existUser')}
              className="block w-full py-1  bg-transparent border rounded-lg px-11 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email address"/>          
            </div>
            {errors.emailadress && <p className="text-sm text-red-400">{errors.emailadress.message}</p>}  

            <div className="relative flex items-center mt-4">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </span>

                <input type="password" {...register("Password", { required: 'Password is required',
            minLength: { value: 6,
              message: 'Password must be at least 6 characters long'}, })} 
              className="block w-full px-10 py-1 bg-transparent border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password"/>           
            </div>
            {errors.Password && <p className="text-sm text-red-400">{errors.Password.message}</p>}

            <div className="relative flex items-center mt-4">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </span>

                <input type="password" {...register("ConfirmPassword", { required:'Confirm Password is required',
            validate: (value) =>
              value === Password || 'Passwords do not match', })}
               className="block w-full px-10 py-1 bg-transparent border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Confirm Password"/>
            </div>
            {errors.ConfirmPassword && <p className="text-sm text-red-400">{errors.ConfirmPassword.message}</p>}

            <div className="mt-6">
                <input type="submit" disabled={isSubmitting} value="Sign Up" className="w-full px-6 py-1 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" />
                    

                <div className="mt-6 text-center ">
                    <a href="./SignIn" className="text-sm text-blue-500 hover:underline">
                        Already have an account?
                    </a>
                </div>
            </div>
        </form>
    </div>

      </div>
    </div>
  )
}


