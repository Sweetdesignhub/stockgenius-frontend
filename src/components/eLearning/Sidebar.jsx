// import React, { useState } from "react";
// import { FaMedal } from "react-icons/fa";
// import { MdOutlineAutoStories, MdOutlineGroup, MdOutlineLocalLibrary } from "react-icons/md";
// import { GoTrophy } from "react-icons/go";

// const Sidebar = ({ onSelect }) => {
//   const [activeIcon, setActiveIcon] = useState("learning"); // Default selected icon

//   const handleSelect = (key) => {
//     setActiveIcon(key);
//     onSelect(key);
//   };

//   return (
//     <div
//       className="w-[8%] p-4 pt-8 flex flex-col items-center gap-8 rounded-xl backdrop-blur-xl"
//       style={{
//         background:
//           "linear-gradient(180deg, rgba(90, 64, 46, 0) 0%, rgba(51, 36, 27, 0.1) 100%), radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 99.59%)",
//         boxShadow:
//           "0px 25.38px 50.77px 0px #00000033, 0px 12.69px 25.38px 0px #0000000D, 0px 4.23px 8.46px 0px #0000000D, 0px 0px 84.62px 0px #FFE2CC40 inset",
//       }}
//     >
//       {/* Sidebar Icons */}
//       {[
//         { icon: <MdOutlineAutoStories />, key: "learning" },
//         { icon: <FaMedal />, key: "medal" },
//         { icon: <GoTrophy />, key: "trophy" },
//         { icon: <MdOutlineLocalLibrary />, key: "library" },
//         { icon: <MdOutlineGroup />, key: "group" },
//       ].map(({ icon, key }) => (
//         <div
//           key={key}
//           className={`w-10 h-10 text-xl flex justify-center items-center rounded-lg transition-all duration-300 cursor-pointer ${
//             activeIcon === key
//               ? "bg-[#884427] text-white" // Selected Icon Effect
//               : "bg-white text-[#FF9A00] hover:bg-[#884427] hover:text-white" // Normal & Hover Effect
//           }`}
//           onClick={() => handleSelect(key)}
//         >
//           {icon}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Sidebar;


import React from "react";
import { NavLink } from "react-router-dom";
import { FaMedal } from "react-icons/fa";
import { MdOutlineAutoStories, MdOutlineGroup, MdOutlineLocalLibrary } from "react-icons/md";
import { GoTrophy } from "react-icons/go";

const Sidebar = () => {
  const tabs = [
    { icon: <MdOutlineAutoStories />, key: "learning", path: "/e-learning/learning" },
    { icon: <FaMedal />, key: "medal", path: "/e-learning/medal" },
    { icon: <GoTrophy />, key: "trophy", path: "/e-learning/trophy" },
    { icon: <MdOutlineLocalLibrary />, key: "library", path: "/e-learning/library" },
    { icon: <MdOutlineGroup />, key: "group", path: "/e-learning/group" },
  ];

    return (
    <div
      className={`
  relative md:sticky md:top-[2%]
  w-full md:w-[8%] md:min-w-[60px] md:max-w-[90px]
 h-16 md:h-[88vh] lg:h-[92vh] xl:h-[95vh] 2xl:h-[98vh]
  flex flex-row md:flex-col
  items-center
  justify-center md:justify-start
  gap-4 md:gap-[calc(3vh)] lg:gap-[calc(4vh)] xl:gap-[calc(4vh)]
  my-2 md:my-0
  rounded-xl
  backdrop-blur-xl
  px-2 md:px-4
  py-2 md:py-[3vh]
  bg-white/95 md:bg-white/80
  shadow-lg
  z-[30]
  transition-all duration-300
`}
      style={{
        background:
          "linear-gradient(180deg, rgba(90, 64, 46, 0) 0%, rgba(51, 36, 27, 0.1) 100%), radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 99.59%)",
        boxShadow:
          "0px 25.38px 50.77px 0px #00000033, 0px 12.69px 25.38px 0px #0000000D, 0px 4.23px 8.46px 0px #0000000D, 0px 0px 84.62px 0px #FFE2CC40 inset",
      }}
    >
      {tabs.map(({ icon, key, path }) => (
        <NavLink
          key={key}
          to={path}
          className={({ isActive }) =>
            `w-8 h-8 sm:w-10 sm:h-10 
             text-lg sm:text-xl 
             flex justify-center items-center 
             rounded-lg 
             transition-all duration-300 
             cursor-pointer ${
              isActive
                ? "bg-[#884427] text-white"
                : "bg-white text-[#FF9A00] hover:bg-[#884427] hover:text-white"
            }`
          }
        >
          {icon}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;