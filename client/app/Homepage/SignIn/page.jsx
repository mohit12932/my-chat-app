"use client"
import React,{useState,useEffect} from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image'

const Page = () => {
    const { register, handleSubmit,setError,clearErrors, formState: { errors,isSubmitting } } = useForm();
    const router = useRouter();
        
    const [Client,setClient]=useState(0); 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

     useEffect(() => {
        setClient(1);
      }, []);
 
    const togglePasswordVisibility = () => {   
        setIsPasswordVisible(!isPasswordVisible); };

        const onSubmit = async (data)=> {

            try{ let response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/signin`,data); 
                let result =response.data;

                if(response.status==201){
                    alert("Logged in Successfully")
                    if(Client){
                   localStorage.setItem('token', result.token);
                   localStorage.setItem('user', JSON.stringify(result.user));
                   localStorage.setItem('friends', result.friends);}
                    router.push('/chatpage');
                    }
                }catch (error) {
                    if (error.response && error.response.status === 409) {
                        setError("existUser", { message: error.response.data.error });
                    } else {
                        console.error(error);
                        alert('An unexpected error occurred');
                    }
                }
            }

  return (
    <div className="bg-custom-background bg-cover bg-no-repeat h-screen  flex justify-center items-center">
      <div className="w-full h-auto max-w-72 sm:max-w-sm py-6 sm:py-12 sm:px-6  mx-auto backdrop-blur-3xl border rounded-lg shadow-md ">
    <div className="container flex items-baseline justify-center h-auto px-6 mx-auto">
        <form className="w-full max-w-md"onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center mx-auto">
                <Image width={500} height={300} className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt=""/>
            </div>
            
            <div className="flex items-center justify-center mt-6">
                <a href="#" className="w-1/3 pb-2 font-medium text-center capitalize border-b-2 border-blue-400">
                    sign in
                </a>
                
                <a href="./SignUp" className="w-1/3 pb-2 font-medium text-center capitalize border-b">
                    sign up
                </a>
            </div>
             
            {errors.existUser && <p className="text-sm  mt-2 text-center text-red-400">{errors.existUser.message}</p>}

            <div className="mt-4">
            <label for="username"  className="block text-sm font-medium">Email address</label>
            <input type="text"  {...register("emailaddress", { required:'Username is required' })} onChange={() => clearErrors('existUser')}
            className="block w-full px-4 py-2 border bg-transparent rounded-lg focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>
        {errors.Username && <p className="text-sm text-red-400">{errors.Username.message}</p>}

        <div className="mt-2">
            <div className="flex items-center justify-between">
                <label for="password" className="block text-sm font-medium">Password</label>
                <span className="text-xs font-medium  hover:underline" onClick={togglePasswordVisibility}>
                {isPasswordVisible?(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
    <path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>) :
(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none">
    <path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" stroke-width="1.5" />
</svg> )}
                 </span>
            </div>

            <input type={isPasswordVisible ? 'text' : 'password'}  {...register("Password", { required: 'Password is required',
            minLength: { value: 6,
              message: 'Password must be at least 6 characters long'}, })} onChange={() => clearErrors('existUser')}
              className="block w-full px-4 py-2 bg-transparent border rounded-lg focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>
        {errors.Password && <p className="text-sm text-red-400">{errors.Password.message}</p>}

           
        <div className="mt-8">
            <button disabled={isSubmitting} className="w-full px-6 py-2.5 text-sm font-medium tracking-wide hover:text-gray-800 capitalize transition-colors duration-300 transform bg-transparent border rounded-lg hover:bg-white focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                Sign In
            </button>
        </div>

    <p className="mt-8 text-xs font-light text-center"> Don&apos;t have an account? <a href="./SignUp" className="font-medium text-blue-500 hover:underline">Register</a></p>

         </form>
         

    </div>

      </div>
    </div>
  )
}

export default Page
