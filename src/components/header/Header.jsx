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
import { FaNewspaper, FaBell, FaUsers, FaAngleDown } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import ToggleButton from "../common/ToggleButton";
import { signOut } from "../../redux/user/userSlice";
import api from "../../config";
import { clearRegion, setRegion } from "../../redux/region/regionSlice";
import Select from "react-select";
import Flag from "react-world-flags";
import { setMarket } from "../../redux/region/marketSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const market = useSelector((state) => state.market);
  const region = useSelector((state) => state.region);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // console.log(region);

  const dispatch = useDispatch();

  const isMarketDropdownVisible =
    location.pathname === "/usa/dashboard" ||
    location.pathname === "/usa/stock-lists";

  useEffect(() => {
    if (region) {
      localStorage.setItem("region", region);
    }
  }, [region]);

  const handleRegionChange = (selectedOption) => {
    const selectedRegion = selectedOption.value;
    dispatch(setRegion(selectedRegion));
  };

  const handleMarketChange = (event) => {
    const selectedMarket = event.target.value;
    dispatch(setMarket(selectedMarket));
  };

  const handleMarketChangeMobile = (selectedOption) => {
    const selectedMarket = selectedOption ? selectedOption.value : "";
    dispatch(setMarket(selectedMarket));
  };

  let navigation = [];

  if (region === "india") {
    navigation = [
      { name: "Dashboard", to: `/india/dashboard`, icon: MdDashboard },
      {
        name: "NSE 100 AI Insights",
        to: `/india/NSE100-ai-insights`,
        icon: FaNewspaper,
      },
      { name: "Portfolio", to: `/india/portfolio`, icon: FaBagShopping },
    ];
  } else if (region === "usa") {
    navigation = [
      { name: "Dashboard", to: `/usa/dashboard`, icon: MdDashboard },
      {
        name: "Stock Lists",
        to: `/usa/stock-lists`,
        icon: FaNewspaper,
      },
      { name: "Portfolio", to: `/usa/portfolio`, icon: FaBagShopping },
    ];
  }

  const regionOptions = [
    {
      value: "india",
      label: (
        <div className="flex items-center">
          <Flag
            code="IN"
            style={{ marginRight: "10px", width: "20px", height: "20px" }}
          />
          <span>India</span>
        </div>
      ),
    },
    {
      value: "usa",
      label: (
        <div className="flex items-center">
          <Flag
            code="US"
            style={{ marginRight: "10px", width: "20px", height: "20px" }}
          />
          <span>USA</span>
        </div>
      ),
    },
  ];

  const handleSignOut = async () => {
    try {
      await api.post("/api/v1/auth/sign-out");
      dispatch(clearRegion());
      localStorage.removeItem("fyers_access_token")
      dispatch(signOut());
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuClose = () => setMobileMenuOpen(false);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      width: "10rem",
      borderRadius: "0.5rem",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      border: "none",
      borderRadius: "0",
      backgroundColor: state.isSelected
        ? "#3A6FF8"
        : state.isFocused
        ? "#EBEBEB"
        : null,
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
    }),
  };

  const marketOptions = [
    {
      value: "NYSE",
      label: (
        <div className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd7b86ea3de06476c86cc8c3083afa102"
            alt="NYSE"
            className="w-w h-4"
          />
        </div>
      ),
    },
    {
      value: "NASDAQ",
      label: (
        <div className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F62122be093c24c95b6bdb5e7b76f1984"
            alt="NASDAQ"
            className="w-4 h-4"
          />
        </div>
      ),
    },
  ];

  const marketCustomStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      "& > svg": {
        margin: "0",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#4882F3",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#e2f4ff" : "transparent",
      color: "#333",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
    }),
    menuList: (provided) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };

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
          <Link to="/" className="-m-1.5 p-1.5 text-lg font-[aldrich]">
            Stockgenius.ai
          </Link>
        </div>
        <div className="flex lg:hidden">
          <div>
            {region ? (
              <div>
                {region === "india" ? (
                  <div className="flex items-center justify-center py-[6px] px-2  rounded-xl">
                    {/* <Flag
                      code="IN"
                      style={{
                        width: "35px",
                        height: "25px",
                      }}
                    /> */}
                  </div>
                ) : region === "usa" && isMarketDropdownVisible ? (
                  <div className="flex items-center bg-white rounded-xl">
                    <Select
                      options={marketOptions}
                      onChange={handleMarketChangeMobile}
                      value={marketOptions.find(
                        (option) => option.value === market
                      )}
                      classNamePrefix="react-select"
                      styles={marketCustomStyles}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div>Region flag</div>
            )}
          </div>
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
              <div className="flex items-center">
                <div>
                  {region ? (
                    <div>
                      {region === "india" ? (
                        <div className="flex items-center justify-center py-[6px] px-2 bg-white rounded-xl">
                          <Flag
                            code="IN"
                            style={{
                              // marginRight: "10px",
                              width: "35px",
                              height: "25px",
                            }}
                          />
                          {/* <span className="text-black">India</span> */}
                        </div>
                      ) : region === "usa" && isMarketDropdownVisible ? (
                        <div className="flex items-center py-[6px] px-1 bg-white rounded-xl">
                          <Flag
                            code="US"
                            style={{
                              marginRight: "5px",
                              width: "35px",
                              height: "25px",
                            }}
                          />
                          <div>
                            <select
                              onChange={handleMarketChange}
                              value={market}
                              className="font-bold text-sm text-[#FF0000] w-20 border-none outline-none"
                            >
                              <option value="" disabled>
                                Select Market
                              </option>
                              <option value="NYSE">NYSE</option>
                              <option value="NASDAQ">NASDAQ</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <div>Region flag</div>
                  )}
                </div>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full  text-md focus:outline-none">
                      <div className="flex items-center px-2 ">
                        <img
                          className="h-9 w-9 mr-2 rounded-xl"
                          src={currentUser.avatar}
                          alt="User avatar"
                          loading="lazy"
                        />
                        <div className="flex items-center">
                          <h2 className="mr-2 capitalize">
                            {currentUser.username.slice(0, 10)}
                          </h2>
                          <FaAngleDown />
                        </div>
                      </div>
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
                            to={`/${region}/profile`}
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
                            to={`/${region}/brokerage`}
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
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Select
                  id="region"
                  className=" text-black mr-2"
                  value={regionOptions.find(
                    (option) => option.value === region
                  )}
                  onChange={handleRegionChange}
                  options={regionOptions}
                  placeholder="Select Region"
                  styles={customStyles}
                  required
                />
                <Link to={"/sign-in"}>Log in / Register</Link>
              </div>
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
              <Link to="/" onClick={handleMenuClose}>
                <img
                  className="h-7 mr-2"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
                  alt="Stockgenius.ai"
                />
              </Link>
              <Link
                to="/"
                onClick={handleMenuClose}
                className="-m-1.5 p-1.5 text-lg font-[aldrich]"
              >
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
                {currentUser ? (
                  <div className=" flex flex-col">
                    <div className=" flex justify-between">
                      <h1 className="py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900">
                        Switch Theme
                      </h1>
                      <ToggleButton className="mr-4" />
                    </div>
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
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Select
                      id="region-mobile"
                      className=" text-black"
                      value={regionOptions.find(
                        (option) => option.value === region
                      )}
                      onChange={handleRegionChange}
                      options={regionOptions}
                      placeholder="Select Region"
                      styles={customStyles}
                      required
                    />
                    <Link
                      className="text-base font-[poppins] leading-7 dark:text-white text-gray-900"
                      to={"/sign-in"}
                      onClick={handleMenuClose}
                    >
                      Log in / Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
