import React, { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from 'axios'
import toast from 'react-hot-toast'


function Signup() {
  const { isAuthenticated, showSignup, setShowsignup } = useContext(AppContext);
  const [userName, setUsername] = useState("Rahul");
  const [userEmail, setUseremail] = useState("rahul@gmail.com");
  const [userPassword, setUserpassword] = useState("Rahul@123");
  const [isSignup, setIssignup] = useState(true);

  const [showPassword, setShowpassword] = useState(false)
  const handleToggleSignup = (event) => {
    event.preventDefault()
    setIssignup(true);
  };
  const handleToggleLogin = (event) => {
    event.preventDefault()
    setIssignup((prev) => false);
  };

  const handleSignup = async(event) =>{
    try {
        event.preventDefault()
        if(!userName || !userPassword || !userEmail) return toast.error('Please fill all the required fields')
        const res = await axios.post('http://localhost:3000/api/v1/user/register' , {userName,userEmail,userPassword},{withCredentials:true})
        const {success,message,user} = res.data
        console.log(user)
        if(success){
            console.log(res)
            toast.success(message)
        }else{
            console.log('Error while registering ---->> ',res)
        }
    } catch (error) {
        console.log('Error in handleSignup --->> ',error)
        return toast.error('Something went wrong')
    }
  }

  const handleLogin = async(event) =>{
    try {
        event.preventDefault()
    if(!userEmail || !userPassword) return toast.error('Please fill all the required fields')
    const res = await axios.post(' http://localhost:3000/api/v1/user/login',{userEmail,userPassword},{withCredentials:true})
    const {success,message,user,error} = res.data
    localStorage.setItem('user',JSON.stringify(user))
    if(success){
        toast.success(message)
        console.log(message)
    }else{
        toast.error(error)
        console.log(error)
    }
    } catch (error) {
        console.log('Error in logging in ---->> ',error.response.data.error)
        return toast.error(error.response.data.error)
    }
  }
  
  return (
    <div className="w-full h-full flex justify-center items-center z-[999] absolute top-0 left-0 bg-[#000000a4] md:p-5 ">
      <div className="w-full md:w-[40vw] pb-3 bg-[#f1f9fd] rounded-sm !pt-4 relative">
        <button
          className="absolute right-2 top-1 text-xl font-bold cursor-pointer"
          onClick={() => setShowsignup(false)}
        >
          ❌
        </button>

        <form>
        <section className="flex gap-5 w-full justify-center ">
          {" "}
          <button
            className={`text-lg flex gap-2 text-black font-normal cursor-pointer  ${
              isSignup ? "bg-[#FFDB52]" : "bg-white"
            } !px-5 !py-2 `}
            onClick={handleToggleSignup}
          >
            Signup
          </button>{" "}
          <button
            className={`text-lg flex gap-2 text-black font-normal cursor-pointer ${
              !isSignup ? "bg-[#FFDB52]" : "bg-white"
            } !px-5 !py-2 `}
            onClick={handleToggleLogin}
          >
            Login
          </button>{" "}
        </section>

        {/* input section */}
        <section className="!px-10 !py-4 flex-col  !mt-4">
          {isSignup && (
            <input
              type="text"
              value={userName}
              placeholder="Your Name"
              onChange={(event)=>setUsername(event.target.value) }
              id="userName"
              className="w-full !px-4 !py-2 border-2 !mt-2 border-amber-200 outline-none rounded-md"
            />
          )}
          <input
            type="email"
            value={userEmail}
            placeholder="Your Email"
            onChange={(event)=>setUseremail(event.target.value) }
            id="userEmail"
            className="w-full !px-4 !py-2 border-2 !mt-2 border-amber-200 outline-none rounded-md"
          />
          <input
            type={showPassword ? 'text':'password'}
            value={userPassword}
            placeholder="Create Password"
            onChange={(event)=>setUserpassword(event.target.value) }
            id="userPassword"
            className="w-full !px-4 !py-2 border-2 !mt-2 border-amber-200 outline-none rounded-md"
          />
          <p className="text-sm font-semibold cursor-pointer" onClick={()=>setShowpassword(prev => !prev) }>Show password</p>
        </section>

        <section className="!px-10 !py-4 flex-col  !mt-4">
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            type="submit"
            className="!w-full !px-4 !py-2 bg-[#FFDB52] rounded-lg cursor-pointer hover:bg-yellow-500 transition-all duration-150"
          >
            {" "}
            {isSignup ? "Create Account" : "Login"}{" "}
          </button>
        </section>
        </form>
      </div>
    </div>
  );
}

export default Signup;
