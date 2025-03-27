import React from "react";
import { Link } from "react-router-dom";

function ModulesCard({ moduleTitle, moduleDescription, bgImage, link, descColor }) {
  return (
    <Link to={link} className="block w-full h-full">
      <div
        className="relative rounded-2xl text-white bg-cover bg-center flex flex-col justify-center text-left h-48 w-[95%] p-8 overflow-hidden transition-transform transform hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})`, height: "80%", width: "95%" }}
      >
        {/* Blurry Overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-2xl"></div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-center h-full">
          <h1 className="text-2xl font-bold mb-2">{moduleTitle}</h1>
          <p className="text-sm" style={{ color: descColor }}>{moduleDescription}</p>
        </div>
      </div>
    </Link>
  );
}

export default ModulesCard;
