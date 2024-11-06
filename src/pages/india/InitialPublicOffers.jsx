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


function InitialPublicOffers() {
  const [selectedOption, setSelectedOption] = useState("All");
  const [ipoData, setIpoData] = useState([]);
  const [suggestionCardsData, setSuggestionCardsData] = useState([]);
  const [selectedIPO, setSelectedIPO] = useState(ipoData[0]?.company || "");
  const [selectedCategory, setSelectedCategory] = useState("Ongoing");
  const { theme } = useTheme();

  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);

  const options = ["All", "SME", "DEBT", "EQUITY"];
  const categories = ["Ongoing", "Upcoming", "Past"];

  // Fetch IPO data from API
  useEffect(() => {
    const fetchIPOData = async () => {
      try {
        const response = await api.get(`/api/v1/IPOs/get-all-ipos`);
        console.log("Fetched IPO Data:", response.data.data);

        if (response.data.data && Array.isArray(response.data.data)) {
          setIpoData(response.data.data);
          // Set the default selected IPO to the first IPO's company name
          if (response.data.data.length > 0) {
            setSelectedIPO(response.data.data[0].company);
          }
        } else {
          console.error("IPO data is not an array or is undefined.");
        }
      } catch (error) {
        console.error("Error fetching IPO data:", error);
      }
    };
    fetchIPOData();
  }, []);

  useEffect(() => {
    const fetchIPOSuggestionCardData = async () => {
      try {
        const response = await api.get(`/api/v1/IPOs/get-all-suggestion-cards`);
        console.log("Fetched suggestion card Data:", response);

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

    fetchIPOSuggestionCardData();
  }, []);

  // Filter the IPO data based on the selected option
  const filteredIpoData = ipoData.filter(
    (ipo) =>
      (selectedOption === "All" || ipo.exchangeType === selectedOption) &&
      (selectedCategory === "Ongoing" ? ipo.category === "ONGOING" :
        selectedCategory === "Upcoming" ? ipo.category === "UPCOMING" :
        selectedCategory === "Past" ? ipo.category === "PAST" : true)
  );

  const handleSelect = (company) => {
    setSelectedIPO(company);
  };

  // Format the IPO dates
  const formatIpoDate = (startDate, endDate) => {
    const options = { day: 'numeric', month: 'short' };
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.toLocaleDateString('en-US', options);
    const endDay = end.toLocaleDateString('en-US', options);

    // Check if both dates fall in the same month and return formatted string
    if (start.getMonth() === end.getMonth()) {
      return `${startDay}-${endDay}`;
    }

    return `${startDay} - ${endDay}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen lg:px-32 px-4 py-6 relative">
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

      <div className="bg-white min-h-[85vh] news-table rounded-2xl">
        <div className="p-4 flex flex-col items-center justify-between lg:flex-row lg:items-start lg:gap-4">
          {/* Left Side (100% for mobile, 45% for desktop) */}
          <div className="w-full lg:w-[45%]">
            <div className="flex justify-between items-center border-b border-[#FFFFFF1A] pb-4">
              <h1 className="font-semibold text-lg mb-4 lg:mb-0 lg:mr-4">
                Initial Public Offers (IPOs)
              </h1>

              <div className="flex ">
                {currentUser.isAdmin && currentUser.role === "admin" && (
                  <Link to={"/india/admin-create-ipos"} className="mr-3">
                    <button className="inline-flex w-full justify-center gap-x-1.5 rounded-xl bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      Create Ipos [Admin]
                    </button>
                  </Link>
                )}

                {/* Dropdown Menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-xl bg-white px-3 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      {selectedOption}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 h-5 w-5 text-gray-400"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                    <div className="py-1">
                      {options.map((option) => (
                        <MenuItem
                          key={option}
                          onClick={() => setSelectedOption(option)}
                        >
                          <div
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${
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
            <div className="flex justify-between items-center pt-4">
              <div className="flex justify-center items-center">
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center mr-4 cursor-pointer"
                  >
                    <div
                      className={`p-1 rounded-md ${
                        selectedCategory === category
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <BsStopwatchFill className="text-white" size={22} />
                    </div>
                    <h2 className="ml-2 font-[poppins]">{category}</h2>
                  </div>
                ))}
              </div>

              {/* Information Icon */}
              <div>
                <IoMdInformationCircle className="text-gray-500" size={30} />
              </div>
            </div>

            {/* Render filtered IPO Cards */}
            <div className="pt-4 mt-2 overflow-y-scroll overflow-x-hidden min-h-[70vh] max-h-[70vh] rounded-lg">
              {filteredIpoData.length > 0 ? (
                filteredIpoData.map((ipo) => (
                  <IPOCard
                    key={ipo.name}
                    logo={ipo.logo}
                    name={ipo.name}
                    company={ipo.company}
                    ipoDate={formatIpoDate(ipo.ipoStartDate, ipo.ipoEndDate)} 
                    listingDate={formatDate(ipo.listingDate)}
                    type={ipo.exchangeType}
                    sentimentScore={ipo.sentimentScore || '0.00'}
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
          <div className="h-[10%] overflow-x-auto flex space-x-2 py-1">
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
    </div>
  );
}

export default InitialPublicOffers;
