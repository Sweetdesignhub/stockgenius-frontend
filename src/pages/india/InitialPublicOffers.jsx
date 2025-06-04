/**
 * File: InitialPublicOffers
 * Description: This component displays a list of Initial Public Offerings (IPOs) with filtering options such as "All", "SME", "DEBT", and "EQUITY". It also allows the user to filter IPOs by their category (Upcoming, Ongoing, or Past). The IPO data and suggestion cards are fetched from the backend, and the IPO details can be viewed upon selecting an individual IPO. The layout is responsive, with a mobile-friendly design and a desktop version that splits the page into two sections: a list of IPOs and a set of suggestion cards. A loading state is displayed while data is being fetched.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { IoMdInformationCircle } from "react-icons/io";
import { BsStopwatchFill } from "react-icons/bs";
import IPOCard from "../../components/initialPublicOffers/IpoCard";
import SuggestionCard from "../../components/initialPublicOffers/SuggestionCard";
import { useTheme } from "../../contexts/ThemeContext";
import IPODetail from "../../components/initialPublicOffers/IpoDetail";
import api from "../../config";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../../components/common/Loading";

function InitialPublicOffers() {
  const [selectedOption, setSelectedOption] = useState("All");
  const [ipoData, setIpoData] = useState([]);
  const [suggestionCardsData, setSuggestionCardsData] = useState([]);
  const [selectedIPO, setSelectedIPO] = useState(ipoData[0]?.company || "");
  const [selectedCategory, setSelectedCategory] = useState("Upcoming");
  const { theme } = useTheme();

  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const options = ["All", "SME", "DEBT", "EQUITY"];
  const categories = ["Ongoing", "Upcoming", "Past"];

  useEffect(() => {
    const fetchIPOData = async () => {
      try {
        const response = await api.get(`/api/v1/IPOs/get-all-ipos`);
        if (response.data.data && Array.isArray(response.data.data)) {
          setIpoData(response.data.data);
          setSelectedIPO(response.data.data[0]?.company || "");
        } else {
          console.error("IPO data is not an array or is undefined.");
        }
      } catch (error) {
        console.error("Error fetching IPO data:", error);
      }
    };

    const fetchIPOSuggestionCardData = async () => {
      try {
        const response = await api.get(`/api/v1/IPOs/get-all-suggestion-cards`);
        if (response.data?.data && Array.isArray(response.data.data)) {
          setSuggestionCardsData(response.data.data);
        } else {
          console.error(
            "Suggestion card data is not an array or is undefined."
          );
        }
      } catch (error) {
        console.error("Error fetching suggestion card data:", error);
      }
    };

    // Call both functions and wait for completion before updating loading state
    Promise.all([fetchIPOData(), fetchIPOSuggestionCardData()]).then(() =>
      setLoading(false)
    );
  }, []);

  // Filter the IPO data based on the selected option
  const filteredIpoData = ipoData.filter(
    (ipo) =>
      (selectedOption === "All" || ipo.exchangeType === selectedOption) &&
      (selectedCategory === "Ongoing"
        ? ipo.category === "ONGOING"
        : selectedCategory === "Upcoming"
        ? ipo.category === "UPCOMING"
        : selectedCategory === "Past"
        ? ipo.category === "PAST"
        : true)
  );

  const handleSelect = (company) => {
    setSelectedIPO(company);
  };

  // Format IPO dates or display "To be announced" if dates are null
  const formatIpoDate = (startDate, endDate) => {
    if (!startDate && !endDate) return "To be announced";

    const options = { day: "numeric", month: "short" };
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.toLocaleDateString("en-US", options);
    const endDay = end.toLocaleDateString("en-US", options);

    if (start.getMonth() === end.getMonth()) {
      return `${startDay}-${endDay}`;
    }

    return `${startDay} - ${endDay}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "To be announced";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-fit lg:px-32 p-4 relative page-scrollbar">
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F6e45c8cb7d324c3fba73ef975dbfec87"
        alt="bull"
      />
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F4fb1f7b4c9434cd8ab2b4f76469e60ab"
        alt="bear"
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div className="bg-white min-h-[85vh] news-table rounded-2xl">
          <div className="p-4 flex flex-col items-center justify-between lg:flex-row lg:items-start lg:gap-4">
            {/* Left Side (100% for mobile, 45% for desktop) */}
            <div className="w-full lg:w-[45%]">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#FFFFFF1A] pb-2 sm:pb-4">
  <h1 className="font-semibold text-base sm:text-lg mb-2 sm:mb-0">
    Initial Public Offers (IPOs)
  </h1>

  <div className="flex items-center space-x-2">
    {currentUser.isAdmin && currentUser.role === "admin" && (
      <Link to={"/india/admin-create-ipos"} className="flex-shrink-0">
          <button className="inline-flex justify-center items-center gap-x-1 rounded-lg sm:rounded-xl bg-white px-3 py-1 text-xs sm:text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <span className="whitespace-nowrap">Create Ipos [Admin]</span>
          </button>
        </Link>
    )}

    {/* Dropdown Menu */}
    <Menu as="div" className="relative">
      <MenuButton className="inline-flex justify-center items-center gap-x-1 rounded-lg sm:rounded-xl bg-white px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-[#3A6FF8] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {selectedOption}
        <ChevronDownIcon
          aria-hidden="true"
          className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-1 w-28 sm:w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
        <div className="py-0.5 sm:py-1">
          {options.map((option) => (
            <MenuItem
              key={option}
              onClick={() => setSelectedOption(option)}
            >
              <div
                className={`block px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-[#3A6FF8] hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${
                  selectedOption === option ? "bg-gray-100" : ""
                }`}
              >
                {option}
              </div>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  </div>
</div>

              {/* Ongoing, Upcoming, Past Selection */}

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 sm:pt-4 w-full">
  <div className="flex justify-between items-center w-full">
    <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2 sm:gap-4">
      {categories.map((category) => (
        <div
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`flex items-center justify-center sm:justify-start cursor-pointer transition-colors duration-200 ${
            selectedCategory === category ? 'opacity-100' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <div
            className={`p-1 sm:p-1.5 rounded-md ${
              selectedCategory === category
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          >
            <BsStopwatchFill className="text-white" size={12} />
          </div>
          <h2 className="ml-1 sm:ml-2 font-[poppins] text-[10px] sm:text-xs whitespace-nowrap">
            {category}
          </h2>
        </div>
      ))}
    </div>

    {/* Information Icon - Now visible on mobile */}
    <div className="flex items-center ml-2 sm:ml-4">
      <IoMdInformationCircle className="text-gray-500" size={16} />
    </div>
  </div>
</div>

              {/* Render filtered IPO Cards */}
              <div className="pt-4 mt-2 overflow-y-scroll scrollbar-hide overflow-x-hidden min-h-[20vh] max-h-[67vh] rounded-lg">
                {filteredIpoData.length > 0 ? (
                  filteredIpoData.map((ipo) => (
                    <IPOCard
                      key={ipo.name}
                      logo={ipo.logo}
                      name={ipo.name}
                      company={ipo.company}
                      // ipoDate={formatIpoDate(ipo.ipoStartDate, ipo.ipoEndDate)}
                      // listingDate={formatDate(ipo.listingDate)}
                      ipoDate={
                        ipo.ipoStartDate && ipo.ipoEndDate
                          ? formatIpoDate(ipo.ipoStartDate, ipo.ipoEndDate)
                          : "To be announced"
                      }
                      listingDate={
                        ipo.listingDate
                          ? formatDate(ipo.listingDate)
                          : "To be announced"
                      }
                      type={ipo.exchangeType}
                      sentimentScore={ipo.sentimentScore || "0.00"}
                      decisionRate={ipo.decisionRate}
                      priceRange={`${ipo.priceStartRange}-${ipo.priceEndRange}`}
                      minQuantity={ipo.minQuantity}
                      onSelect={handleSelect}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F774045b915a94da8b083607e7ede6341"
                      alt="no ipos availabe"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side (100% for mobile, 55% for desktop) */}
            <div className="w-full lg:w-[55%] p-1 flex flex-col h-full mt-6 lg:mt-0">
              <div className="h-[10%] overflow-x-auto flex space-x-2 py-1 scrollbar-hide">
                {suggestionCardsData.length > 0 ? (
                  suggestionCardsData.map((card, index) => (
                    <div className="flex-shrink-0" key={index}>
                      <SuggestionCard
                        logo={card.logo}
                        category={card.category}
                        subCategory={card.subCategory}
                        change={card.change}
                        title={card.title}
                        image={card.graph}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center w-96 p-4 text-gray-500">
                    No suggestion available.
                  </div>
                )}
              </div>

              <div className="h-[90%] mt-4">
                {selectedIPO && (
                  <IPODetail
                    theme={theme}
                    formatDate={formatDate}
                    ipoData={
                      ipoData.length > 0
                        ? ipoData.find(
                            (ipo) =>
                              selectedIPO.toLowerCase() ===
                              ipo.company.toLowerCase()
                          ) || null
                        : null
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InitialPublicOffers;
