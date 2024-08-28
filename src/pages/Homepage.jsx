import React from "react";
import logo from "../assets/Let’sbike, Lisbon verde com roda.png";
import logo2 from "../assets/Let’sbike, Lisbon svg.svg";
import logo3 from "../assets/Let’sbike, Lisbon branco svg.svg";
import logo4 from "../assets/Let’sbike, Lisbon com laranja e branco.svg";

function Homepage() {
  return (
    <div className="bg-green-600 w-full h-screen flex items-center justify-center">
      {/* Container that fills the viewport */}
      <div className="text-center">
        <p className="text-white text-2xl">Welcome to</p>
        <img src={logo4} alt="logo" className="mx-auto" />
        
      </div>
    </div>
  );
}

export default Homepage;
