"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const Page = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const onSubmit = async (data) => {
    try {
      let response = await axios.post("http://localhost:8000/signin", data);
      let result = response.data;

      if (response.status === 201) {
        alert("Logged in Successfully");
        
        // Ensure client-only logic remains in the client
        if (typeof window !== "undefined") {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("friends", result.friends);
        }

        router.push("/chatpage");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("existUser", { message: error.response.data.error });
      } else {
        console.error(error);
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="bg-custom-background bg-cover bg-no-repeat h-screen flex justify-center items-center">
      <div className="w-full h-auto max-w-72 sm:max-w-sm py-6 sm:py-12 sm:px-6 mx-auto backdrop-blur-3xl border rounded-lg shadow-md">
        <div className="container flex items-baseline justify-center h-auto px-6 mx-auto">
          <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center mx-auto">
              <Image className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
            </div>

            <div className="flex items-center justify-center mt-6">
              <a href="#" className="w-1/3 pb-2 font-medium text-center capitalize border-b-2 border-blue-400">
                Sign In
              </a>
              <a href="/SignUp" className="w-1/3 pb-2 font-medium text-center capitalize border-b">
                Sign Up
              </a>
            </div>

            {errors.existUser && <p className="text-sm mt-2 text-center text-red-400">{errors.existUser.message}</p>}

            <div className="mt-4">
              <label htmlFor="username" className="block text-sm font-medium">Email address</label>
              <input type="text" {...register("emailaddress", { required: "Email is required" })} onChange={() => clearErrors("existUser")}
                className="block w-full px-4 py-2 border bg-transparent rounded-lg focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
            {errors.emailaddress && <p className="text-sm text-red-400">{errors.emailaddress.message}</p>}

            <div className="mt-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <span className="text-xs font-medium hover:underline" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? "Hide" : "Show"}
                </span>
              </div>

              <input type={isPasswordVisible ? "text" : "password"} {...register("Password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })} onChange={() => clearErrors("existUser")}
                className="block w-full px-4 py-2 bg-transparent border rounded-lg focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
            {errors.Password && <p className="text-sm text-red-400">{errors.Password.message}</p>}

            <div className="mt-8">
              <button disabled={isSubmitting} className="w-full px-6 py-2.5 text-sm font-medium tracking-wide hover:text-gray-800 capitalize transition-colors duration-300 transform bg-transparent border rounded-lg hover:bg-white focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                Sign In
              </button>
            </div>

            <p className="mt-8 text-xs font-light text-center"> Don't have an account? <a href="./SignUp" className="font-medium text-blue-500 hover:underline">Register</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
