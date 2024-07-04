// import { useState } from "react";
// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
//   Dialog,
//   DialogPanel,
// } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import { MdDashboard } from "react-icons/md";
// import { FaNewspaper, FaBell, FaUsers } from "react-icons/fa";
// import { FaBagShopping } from "react-icons/fa6";
// import ToggleButton from "../common/ToggleButton";
// import { signOut } from "../../redux/user/userSlice";
// import api from "../../config";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Header() {
//   const { currentUser } = useSelector((state) => state.user);
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navigation = [
//     { name: "Dashboard", to: "/dashboard", icon: MdDashboard },
//     {
//       name: "NSE 100 AI Insights",
//       to: "/NSE100-ai-insights",
//       icon: FaNewspaper,
//     },
//     { name: "Portfolio", to: "/portfolio", icon: FaBagShopping },
//     // { name: "Notifications", to: "/notifications", icon: FaBell },
//     // { name: "Referrals", to: "/referrals", icon: FaUsers },
//   ];

//   const handleSignOut = async () => {
//     try {
//       await api.post("/api/v1/auth/sign-out");
//       dispatch(signOut());
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleMenuClose = () => setMobileMenuOpen(false);

//   return (
//     <header>
//       <nav
//         className="flex items-center justify-between p-6 lg:px-8"
//         aria-label="Global"
//       >
//         <div className="flex items-center lg:flex-1">
//           <Link to="/">
//             <img
//               className="h-7 mr-3"
//               src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
//               alt="Stockgenius.ai"
//             />
//           </Link>
//           <Link to="/" className="-m-1.5 p-1.5 text-xl font-[aldrich]">
//             Stockgenius.ai
//           </Link>
//         </div>
//         <div className="flex lg:hidden">
//           <ToggleButton className="mr-4" />
//           <button
//             type="button"
//             className="-m-2.5 ml-[1px] inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//             onClick={() => setMobileMenuOpen(true)}
//           >
//             <span className="sr-only">Open main menu</span>
//             <Bars3Icon className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>
//         {currentUser ? (
//           <div className="hidden lg:flex lg:gap-x-12">
//             {navigation.map((item) => (
//               <NavLink
//                 key={item.name}
//                 to={item.to}
//                 className={({ isActive }) =>
//                   classNames(
//                     isActive ? "bg-[#3A6FF8] text-white" : "",
//                     "rounded-md px-3 py-2 text-sm flex items-center gap-2"
//                   )
//                 }
//                 exact="true"
//               >
//                 <item.icon className="h-5 w-5" aria-hidden="true" />
//                 {item.name}
//               </NavLink>
//             ))}
//           </div>
//         ) : (
//           ""
//         )}
//         <div className="hidden lg:flex lg:flex-1 lg:justify-end">
//           <div className="flex items-center gap-3">
//             <ToggleButton className="mr-4" />
//             <Link to="/profile">
//               {currentUser ? (
//                 <Menu as="div" className="relative ml-3">
//                   <div>
//                     <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                       <span className="sr-only">Open user menu</span>
//                       <img
//                         className="h-8 w-8 rounded-full"
//                         src={currentUser.avatar}
//                         alt="User avatar"
//                       />
//                     </MenuButton>
//                   </div>
//                   <Transition
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       <MenuItem>
//                         {({ active }) => (
//                           <Link
//                             to="/profile"
//                             className={classNames(
//                               active ? "bg-gray-100" : "",
//                               "block px-4 py-2 text-sm text-gray-700"
//                             )}
//                           >
//                             Your Profile
//                           </Link>
//                         )}
//                       </MenuItem>
//                       <MenuItem>
//                         {({ active }) => (
//                           <Link
//                             onClick={handleSignOut}
//                             className={classNames(
//                               active ? "bg-gray-100" : "",
//                               "block px-4 py-2 text-sm text-gray-700"
//                             )}
//                           >
//                             Sign out
//                           </Link>
//                         )}
//                       </MenuItem>
//                     </MenuItems>
//                   </Transition>
//                 </Menu>
//               ) : (
//                 <p>Log in / Register</p>
//               )}
//             </Link>
//           </div>
//         </div>
//       </nav>
//       <Dialog
//         className="lg:hidden"
//         open={mobileMenuOpen}
//         onClose={setMobileMenuOpen}
//       >
//         <div className="fixed inset-0 z-50" />
//         <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-[#1C1E55] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//           <div className="flex items-center justify-between">
//             <div className="flex">
//               <Link to="/">
//                 <img
//                   className="h-7 mr-2"
//                   src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
//                   alt="Stockgenius.ai"
//                 />
//               </Link>
//               <Link to="/" className="-m-1.5 p-1.5 text-xl font-[aldrich]">
//                 Stockgenius.ai
//               </Link>
//             </div>
//             <button
//               type="button"
//               className="-m-2.5 rounded-md p-2.5 text-gray-700"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <span className="sr-only">Close menu</span>
//               <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//             </button>
//           </div>
//           <div className="mt-6 flow-root">
//             <div className="-my-6 divide-y divide-gray-500/10">
//               {currentUser ? (
//                 <div className="space-y-2 py-6">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.to}
//                       className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900"
//                       onClick={handleMenuClose}
//                     >
//                       <item.icon className="h-5 w-5" aria-hidden="true" />
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div>
//               ) : (
//                 ""
//               )}
//               <div className="py-6">
//                 <Link to="/profile" onClick={handleMenuClose}>
//                   {currentUser ? (
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={currentUser.avatar}
//                         alt="profile"
//                         className="h-7 w-7 rounded-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={handleSignOut}
//                         className="text-base font-[poppins] leading-7 dark:text-white text-gray-900"
//                       >
//                         Sign out
//                       </button>
//                     </div>
//                   ) : (
//                     <p className="text-base font-[poppins] leading-7 dark:text-white text-gray-900">
//                       Log in
//                     </p>
//                   )}
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </DialogPanel>
//       </Dialog>
//     </header>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaNewspaper, FaBell, FaUsers } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import ToggleButton from "../common/ToggleButton";
import { signOut } from "../../redux/user/userSlice";
import api from "../../config";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country")
  );
  console.log(selectedCountry);

  // console.log('header : ', selectedCountry);
  let navigation = [];

  if (localStorage.getItem("country") === "india") {
    navigation = [
      { name: "Dashboard", to: `/india/dashboard`, icon: MdDashboard },
      {
        name: "NSE 100 AI Insights",
        to: `/india/NSE100-ai-insights`,
        icon: FaNewspaper,
      },
      { name: "Portfolio", to: `/india/portfolio`, icon: FaBagShopping },
    ];
  } else if (localStorage.getItem("country") === "us") {
    navigation = [
      { name: "Dashboard", to: `/us/dashboard`, icon: MdDashboard },
      {
        name: "NSE 100 AI Insights",
        to: `/us/NSE100-ai-insights`,
        icon: FaNewspaper,
      },
      { name: "Portfolio", to: `/us/portfolio`, icon: FaBagShopping },
    ];
  }

  // const navigation = [
  //   { name: "Dashboard", to: `/${selectedCountry}/dashboard`, icon: MdDashboard },
  //   {
  //     name: "NSE 100 AI Insights",
  //     to: `/${selectedCountry}/NSE100-ai-insights`,
  //     icon: FaNewspaper,
  //   },
  //   { name: "Portfolio", to: `/${selectedCountry}/portfolio`, icon: FaBagShopping },
  //   // { name: "Notifications", to: `/${selectedCountry}/notifications`, icon: FaBell },
  //   // { name: "Referrals", to: `/${selectedCountry}/referrals`, icon: FaUsers },
  // ];

  useEffect(() => {
    const storedCountry = localStorage.getItem("country") || "india";
    setSelectedCountry(storedCountry);
  }, []);

  const handleSignOut = async () => {
    try {
      await api.post("/api/v1/auth/sign-out");
      localStorage.removeItem("country");
      dispatch(signOut());
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuClose = () => setMobileMenuOpen(false);

  return (
    <header>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center lg:flex-1">
          <Link to="/">
            <img
              className="h-7 mr-3"
              src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
              alt="Stockgenius.ai"
            />
          </Link>
          <Link to="/" className="-m-1.5 p-1.5 text-xl font-[aldrich]">
            Stockgenius.ai
          </Link>
        </div>
        <div className="flex lg:hidden">
          <ToggleButton className="mr-4" />
          <button
            type="button"
            className="-m-2.5 ml-[1px] inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {currentUser ? (
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive ? "bg-[#3A6FF8] text-white" : "",
                    "rounded-md px-3 py-2 text-sm flex items-center gap-2"
                  )
                }
                exact="true"
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>
        ) : (
          ""
        )}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-3">
            <ToggleButton className="mr-4" />
         
              {currentUser ? (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={currentUser.avatar}
                        alt="User avatar"
                      />
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to={`/${selectedCountry}/profile`}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to={`/${selectedCountry}/brokerage`}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Brokerage
                          </Link>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            onClick={handleSignOut}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </Link>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              ) : (
                <p>Log in / Register</p>
              )}
       
          </div>
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-[#1C1E55] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="flex">
              <Link to="/">
                <img
                  className="h-7 mr-2"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
                  alt="Stockgenius.ai"
                />
              </Link>
              <Link to="/" className="-m-1.5 p-1.5 text-xl font-[aldrich]">
                Stockgenius.ai
              </Link>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {currentUser ? (
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900"
                      onClick={handleMenuClose}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                ""
              )}
              <div className="py-6">
                <Link
                  to={`/${selectedCountry}/profile`}
                  onClick={handleMenuClose}
                >
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt="profile"
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-base font-[poppins] leading-7 dark:text-white text-gray-900"
                      >
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <p className="text-base font-[poppins] leading-7 dark:text-white text-gray-900">
                      Log in
                    </p>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
