import React, { useContext } from "react";
import {NavLink} from 'react-router-dom'
import { AppContext } from "../contexts/AppContext";

function Navbar() {
  const {showSignup, setShowsignup} = useContext(AppContext)
  const handleToggleSignup = () =>{
    setShowsignup(prev => !prev )
  }
  return (
    <nav className="flex justify-between">
      <section className="text-white text-2xl font-bold ">
        Let's Connect
      </section>
      <section className="text-white text-lg font-bold flex justify-between gap-10">
        <NavLink>Join As Guest</NavLink>
        <NavLink onClick={handleToggleSignup} >Register</NavLink>
        <NavLink onClick={handleToggleSignup} >Login</NavLink>
      </section>
    </nav>
  );
}

export default Navbar;
