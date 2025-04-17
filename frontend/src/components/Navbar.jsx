import React from "react";
import {NavLink} from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex justify-between">
      <section className="text-white text-2xl font-bold ">
        Let's Connect
      </section>
      <section className="text-white text-lg font-bold flex justify-between gap-10">
        <NavLink>Join As Guest</NavLink>
        <NavLink>Register</NavLink>
        <NavLink>Login</NavLink>
      </section>
    </nav>
  );
}

export default Navbar;
