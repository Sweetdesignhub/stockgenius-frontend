/**
 * File: Header
 * Description:This component represents the header section of the Stockgenius.ai application. It contains a navigation bar with links to various pages based on the selected region (India/USA) and the current user's authentication status. The header also includes a dropdown for selecting the region and market, a user profile menu, and a toggle button for additional settings. The header is responsive, adapting to both desktop and mobile views. When a user is signed in, the header displays navigation links, the user's avatar, and allows the user to sign out.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useState, useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import PricingDialog from "../pricing/PricingDialog";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { RiFilePaper2Fill } from "react-icons/ri";
import { FaNewspaper, FaAngleDown } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai"; // For submenu arrow
import { BsBank2 } from "react-icons/bs";
import { BsRobot, BsTools } from "react-icons/bs";
import { FaBagShopping } from "react-icons/fa6";
import { FaListAlt } from "react-icons/fa";
import ToggleButton from "../common/ToggleButton";
import { signOut } from "../../redux/user/userSlice";
import api from "../../config";
import { clearRegion, setRegion } from "../../redux/region/regionSlice";
import Select from "react-select";
import Flag from "react-world-flags";
import { setMarket } from "../../redux/region/marketSlice";
import { clearFyersAccessToken } from "../../redux/brokers/fyersSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const market = useSelector((state) => state.market);
  const region = useSelector((state) => state.region);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileStockListOpen, setIsMobileStockListOpen] = useState(false); // New state
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMarketDropdownVisible, setIsMarketDropdownVisible] = useState(true);
  let hoverTimeout;

  // console.log(currentUser);


  // const handleMouseEnter = (index) => setHoveredIndex(index);
  // const handleMouseLeave = () => setHoveredIndex(null);


  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => setIsHovered(false), 300); // delay in ms
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdownOpen((prev) => (prev === index ? null : index));
  };

  const toggleMobileStockList = () => {
    setIsMobileStockListOpen(!isMobileStockListOpen);
  };

  // const isMarketDropdownVisible =
  //   location.pathname === "/usa/dashboard" ||
  //   location.pathname === "/usa/portfolio" ||
  //   location.pathname === "/usa/paper-trading/portfolio" ||
  //   location.pathname === "/usa/stock-lists" ||
  //   location.pathname === "/usa/paper-trading";

  useEffect(() => {
    if (region) {
      localStorage.setItem("region", region);
    }
  }, [region]);

  useEffect(() => {
    setIsMarketDropdownVisible(region === "usa");
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

  const commonItems = [
    { name: "E-Learning", to: `/e-learning`, icon: GiGraduateCap },
  ];

  if (region === "india") {
    navigation = [
      { name: "Dashboard", to: `/india/dashboard`, icon: MdDashboard },
      {
        name: "StockList", // <-- this will be the default shown text
        to: `/india/NSE100-ai-insights`, // default route
        icon: FaNewspaper,
        submenu: [
          { name: "NSE 100 AI Insights", to: `/india/NSE100-ai-insights` },
          { name: "Bank Nifty", to: `/india/bankNifty` },
        ],
      },
      // {
      //   name: "NSE 100 AI Insights",
      //   to: `/india/NSE100-ai-insights`,
      //   icon: FaNewspaper,
      // },
      // { name: "Bank Nifty", to: `/india/bankNifty`, icon: BsBank2 },
      { name: "Portfolio", to: `/india/portfolio`, icon: FaBagShopping },
      { name: "AI Trading Bots", to: `/india/AI-Trading-Bots`, icon: BsRobot },
      {
        name: "IPOs", 
        to: `/india/initial-public-offers`,
        icon: RiFilePaper2Fill,
      },
      { name: "Paper Trading", to: `/india/paper-trading`, icon: FaListAlt },
      { name: "Backtesting Tool", to: `/backtesting-tool`, icon: BsTools },
    ];
  } else if (region === "usa") {
    navigation = [
      { name: "Dashboard", to: `/usa/dashboard`, icon: MdDashboard },
      { name: "Stock Lists", to: `/usa/stock-lists`, icon: FaNewspaper },
      { name: "Portfolio", to: `/usa/portfolio`, icon: FaBagShopping },
      { name: "Paper Trading", to: `/usa/paper-trading`, icon: FaListAlt },
      { name: "Backtesting Tool", to: `/backtesting-tool`, icon: BsTools },
    ];
  }

  // Merge region-specific and common items
  navigation = [...navigation, ...commonItems];

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
      dispatch(clearFyersAccessToken());
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
  // console.log(currentUser);

  return (
    <header className="w-full border-gray-200">
      <nav className="mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex items-center">
          <Link to="/">
            <img
              className="h-7 xl:h-7 lg:h-5 mr-1"
              src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
              alt="Stockgenius.ai"
            />
          </Link>
          <Link to="/" className="ml-1 text-lg xl:text-lg lg:text-sm font-[aldrich]">
            Stockgenius.ai
          </Link>
        </div>
        <div className="flex lg:hidden">
          <div>
            {region ? (
              <div>                {region === "india" ? (
                  <div></div>
                ) : region === "usa" ? (
                  <div className="flex items-center py-[4px] px-1 bg-white rounded-xl">
                    {isMarketDropdownVisible && (
                      <div className="flex items-center">
                        {market === "NYSE" ? (
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd7b86ea3de06476c86cc8c3083afa102"
                            alt="NYSE"
                            className="h-5 sm:h-6 w-auto cursor-pointer"
                            onClick={() => handleMarketChange({ target: { value: "NASDAQ" } })}
                          />
                        ) : (
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F62122be093c24c95b6bdb5e7b76f1984"
                            alt="NASDAQ"
                            className="h-5 sm:h-6 w-auto cursor-pointer"
                            onClick={() => handleMarketChange({ target: { value: "NYSE" } })}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div></div>
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
          <div className="hidden lg:flex lg:gap-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive ? "bg-[#3A6FF8] text-white" : "",
                      "rounded-md px-[5px] py-1.5 text-[13px] flex items-center gap-1.5 xl:text-[13px] lg:text-[10px] whitespace-nowrap xl:px-[7px] xl:py-2 xl:gap-2"
                    )
                  }
                  exact="true"
                >
                  <item.icon className="h-5 w-5 xl:h-5 xl:w-5 lg:h-3.5 lg:w-3.5" aria-hidden="true" />
                  {item.name}
                </NavLink>

                {item.submenu && isHovered && (
                 <div className="absolute top-[calc(100%-2px)] left-0 hidden group-hover:flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-10 min-w-[180px] backdrop-blur-md border border-gray-200 dark:border-gray-700">
                    {item.submenu.map((subItem) => (                      <NavLink
                        key={subItem.name}
                        to={subItem.to}
                        onClick={() => setIsHovered(false)}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap transition-colors duration-150 hover:bg-[#3A6FF8] hover:text-white"
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}          </div>
        ) : (
          ""
        )}        <div className="hidden lg:flex  lg:justify-end">
          <div className="flex items-center gap-4">
            {currentUser && region === "india" && (
              <button 
                onClick={() => setIsPricingOpen(true)}
                className="flex items-center rounded-full px-3 py-1 text-[13px] xl:text-[13px] lg:text-[10px] whitespace-nowrap
                bg-white/10 backdrop-blur-md
                text-amber-500 font-medium transition-all duration-200 
                shadow-lg hover:shadow-amber-500/30
                border-2 border-amber-500/50 hover:border-amber-400
                dark:bg-[rgba(251,191,36,0.1)]">
                Pricing
              </button>
            )}
            <ToggleButton />

            {currentUser ? (
              <div className="flex items-center">
                <div>
                  {region ? (
                    <div>                      {region === "india" ? (
                        <div className="flex items-center justify-center py-[4px] lg:py-[4px] xl:py-[6px] px-2 bg-white rounded-xl">
                          <Flag
                            code="IN"
                            style={{
                              width: "35px",
                              height: "25px",
                            }}
                          />
                        </div>                      ) : region === "usa" ? (
                        <div className="flex items-center py-[4px] lg:py-[4px] xl:py-[6px] px-1 bg-white rounded-xl">
                          <Flag
                            code="US"
                            style={{
                              marginRight: "5px",
                              width: "35px",
                              height: "25px",
                            }}
                          />
                          {isMarketDropdownVisible && (
                            <div>
                              <select
                                onChange={handleMarketChange}
                                value={market}
                                className="font-bold xl:text-sm lg:text-xs text-[#FF0000] w-16 lg:w-16 xl:w-20 border-none outline-none"
                              >
                                <option value="" disabled>
                                  Market
                                </option>
                                <option value="NYSE">NYSE</option>
                                <option value="NASDAQ">NASDAQ</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <div>Region flag</div>
                  )}
                </div>
                <Menu as="div" className="relative">
                  <div>
                    <MenuButton className="relative flex rounded-full text-md focus:outline-none">
                      <div className="flex items-center px-1">
                        <img
                          className="h-9 w-9 xl:h-9 xl:w-9 lg:h-7 lg:w-7 mr-1 rounded-xl"
                          src={currentUser?.avatar}
                          alt="User avatar"
                          loading="lazy"
                        />
                        <div className="flex items-center">
                          <h2 className="mr-1 capitalize xl:text-base lg:text-xs">
                            {currentUser.name.slice(0, 10)}
                          </h2>
                          <FaAngleDown className="xl:h-4 xl:w-4 lg:h-2.5 lg:w-2.5" />
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
                            Profile
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
                            Brokerage
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
                    <div key={item.name}>
                      {item.submenu ? (
                        <div>
                      <button
                        onClick={() => {
                          if (item.name === "StockList") {
                            setIsMobileStockListOpen(!isMobileStockListOpen);
                          }
                        }}
                        className="-mx-3 flex items-center justify-between rounded-lg px-3 py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900 w-full"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                          {item.name}
                        </div>
                        {item.name === "StockList" && (
                          isMobileStockListOpen ? (
                            <AiOutlineCaretUp className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <AiOutlineCaretDown className="h-5 w-5" aria-hidden="true" />
                          )
                        )}
                      </button>
                      {item.name === "StockList" && isMobileStockListOpen && (
                        <div className="mt-2 pl-4">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.to}
                              className="-mx-3 block rounded-lg px-3 py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900"
                              onClick={handleMenuClose}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                      ) : (
                        <Link
                          to={item.to}
                          className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-[poppins] leading-7 dark:text-white text-gray-900"
                          onClick={handleMenuClose}
                        >
                          <item.icon className="h-5 w-5" aria-hidden="true" />                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}                  {currentUser && region === "india" && (
                      <button
                      className="flex items-center gap-2 -mx-3 rounded-lg px-3 py-2 text-base font-[poppins] leading-7
                        bg-amber-500 backdrop-blur-md
                        text-white font-semibold
                        hover:bg-amber-600
                        dark:bg-amber-500 dark:hover:bg-amber-600
                        mt-2 w-full text-left"
                      onClick={() => {
                        setIsPricingOpen(true);
                        handleMenuClose();
                      }}
                    >
                      Pricing
                    </button>
                  )}
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
        </DialogPanel>      </Dialog>
      {currentUser && (
        <PricingDialog isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      )}
    </header>
  );
}
