import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="w-[100vw] h-[100vh] landingMain fixed ">
      <Navbar />

      <main className="w-full h-full  flex flex-col md:flex-row ">
        <section className="h-full md:w-[50%] flex justify-center items-center ">
          <section className="!gap-4">
            <h1 className="text-white text-5xl font-bold">
              <span className="text-[#27DFB3] text-7xl font-extrabold">
                Connect
              </span>{" "}
              with your loved Ones
            </h1>
            <h1 className="text-white text-2xl font-bold !mb-3 ">
              Cover a distance with a click
            </h1>
            <NavLink className="!px-6 !py-2 bg-[#27DFB3] text-black font-semibold rounded-md hover:bg-[#95f7e0] transition-all duration-300 shadow-md ">
              Get Started
            </NavLink>
          </section>
        </section>

        <section className="h-full md:w-[50%]   overflow-hidden flex justify-center items-center">
          <img
            src="/mobile.png"
            alt="Mobile_image"
            className="w-[75%] object-cover"
          />
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
