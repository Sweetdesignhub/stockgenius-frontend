// import React from "react";
// import { Link } from "react-router-dom";

// function ModulesCard({ moduleTitle, moduleDescription, bgImage, link, descColor }) {
//   return (
//     <Link to={link} className="block w-full">
//       <div
//         className="relative rounded-2xl text-white bg-cover bg-center flex flex-col justify-start items-start p-6 overflow-hidden transition-transform transform hover:scale-105"
//         style={{
//           backgroundImage: `url(${bgImage})`,
//           height: "160px", 
//           width: "100%",
//           minWidth: "250px", 
//         }}
//       >
//         {/* Blurry Overlay */}
//         <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>

//         {/* Text Content (Positioned Consistently) */}
//         <div className="relative z-10 flex flex-col justify-start h-full">
//           <h1 className="text-2xl font-bold mb-1">{moduleTitle}</h1> {/* ✅ Title position fixed */}
//           <p className="text-md" style={{ color: descColor }}>{moduleDescription}</p> {/* ✅ Description position fixed */}
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default ModulesCard;


import React from "react";
import { Link } from "react-router-dom";

function ModulesCard({ moduleTitle, moduleDescription, bgImage, link, descColor }) {
  return (
    <Link to={link} className="block w-full">
      <div
        className="relative rounded-2xl text-white bg-cover bg-center flex flex-col justify-start items-start p-6 overflow-hidden transition-transform transform hover:scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
          height: "160px",
          width: "100%",
          minWidth: "250px",
        }}
      >
        {/* Blurry Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>

        {/* Text Content (Positioned Consistently) */}
        <div className="relative z-10 flex flex-col justify-start h-full">
          <h1 className="text-2xl font-bold mb-1">{moduleTitle}</h1>
          <p className="text-md" style={{ color: descColor }}>{moduleDescription}</p>
        </div>
      </div>
    </Link>
  );
}

export default ModulesCard;