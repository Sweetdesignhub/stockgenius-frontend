// import React, { useState } from "react";
// import { useTheme } from "../../contexts/ThemeContext";

// function ToggleButton() {
//   const { theme, updateTheme } = useTheme(); // Access theme state and setter using useTheme hook
//   const [dropdownVisible, setDropdownVisible] = useState(false);

//   const options = [
//     {
//       icon: "sunny",
//       text: "light",
//     },
//     {
//       icon: "moon",
//       text: "dark",
//     },
//   ];

//   const handleClick = (selectedTheme) => {
//     updateTheme(selectedTheme); // Update theme using the provided setter function
//     setDropdownVisible(false);
//   };

//   return (
//     <div className={`duration-100 dark:bg-[#3A6FF8] dark:text-gray-100 bg-gray-100 rounded-2xl relative ${theme === 'dark' ? 'dark' : ''}`}>
//       <button
//         className="w-8 h-8 leading-9 text-xl rounded-full m-1"
//         onClick={() => setDropdownVisible(!dropdownVisible)}
//       >
//         <ion-icon name="sunny"></ion-icon>
//       </button>

//       {dropdownVisible && (
//         <div className="absolute top-14 right-[-3rem] mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg z-10">
//           {options?.map((opt) => (
//             <button
//               key={opt.text}
//               className={`flex capitalize justify-start items-center w-full  px-8 py-2 text-left text-[15px] rounded-lg ${
//                 theme === opt.text ? "text-sky-600" : ""
//               }`}
//               onClick={() => handleClick(opt.text)}
//             >
//               <ion-icon name={opt.icon}></ion-icon> <p className="ml-4">{opt.text}</p>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ToggleButton;

import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ToggleButton() {
  const { theme, updateTheme } = useTheme(); // Access theme state and setter using useTheme hook
  const [enabled, setEnabled] = useState(theme === 'dark');

  useEffect(() => {
    setEnabled(theme === 'dark');
  }, [theme]);

  const handleToggle = () => {
    const newTheme = enabled ? 'light' : 'dark';
    setEnabled(!enabled);
    updateTheme(newTheme); 
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleToggle}
      className={`group relative flex flex-col h-11 w-6 cursor-pointer rounded-full theme-changer p-1 transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-white' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform ease-in-out ${enabled ? 'rotate-90 translate-y-5' : 'rotate-90 translate-y-0'}`}
      />
    </Switch>
  );
}

