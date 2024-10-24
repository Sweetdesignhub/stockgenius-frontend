import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { IoMdInformationCircle } from "react-icons/io";
import { BsStopwatchFill } from "react-icons/bs";
import IPOCard from "../../components/initialPublicOffers/IpoCard";
import SuggestionCard from "../../components/initialPublicOffers/SuggestionCard";
import { useTheme } from "../../contexts/ThemeContext";
import IPODetail from "../../components/initialPublicOffers/IpoDetail";

const ipoData = [
  {
    id: 1,
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F51a081f5a1884d2689b7be1b7d492fcd",
    name: "HYUNDAI",
    company: "Hyundai Motor India",
    ipoDate: "10th-14th Oct 2024",
    listingDate: "17th Oct 2024",
    type: "SME",
    sentimentScore: "0.07",
    decisionRate: "85",
    priceRange: "₹110 - ₹116",
    minQuantity: "1200",
    typeBackground: {
      background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #886627 132.95%)",
      borderImageSource:
        "linear-gradient(180deg, rgba(136, 102, 39, 0.4) 17.19%, rgba(251, 203, 98, 0.77) 100%)",
      boxShadow:
        "inset 0px 8.97px 26.92px 0px #FFB949B2, 0px 8.97px 35.9px 0px #AF733F80",
    },
  },
  {
    id: 2,
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F12a2ccc7725642c296132cfab6933acb",
    name: "BMW",
    company: "Bavarian Motor Works",
    ipoDate: "30th Sep -14th Oct 2024",
    listingDate: "17th Oct 2024",
    type: "DEBT",
    sentimentScore: "0.07",
    decisionRate: "85",
    priceRange: "₹110 - ₹116",
    minQuantity: "1200",
    typeBackground: {
      background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #882776 132.95%)",
      borderImageSource: `linear-gradient(180deg, rgba(136, 39, 118, 0.4) 17.19%, rgba(251, 98, 241, 0.77) 100%)`,
      boxShadow: `inset 0px 8.97px 26.92px 0px #FF49F3B2, 0px 8.97px 35.9px 0px #AF3FA080`,
    },
  },
  {
    id: 3,
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F845d206e55f14eea9cf74739a2b7c702",
    name: "MCD",
    company: "McDonald’s Corp",
    ipoDate: "29th Sep -1Oth Oct 2024",
    listingDate: "16th Oct 2024",
    type: "SME",
    sentimentScore: "0.07",
    decisionRate: "85",
    priceRange: "₹110 - ₹116",
    minQuantity: "1200",
    typeBackground: {
      background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #886627 132.95%)",
      borderImageSource:
        "linear-gradient(180deg, rgba(136, 102, 39, 0.4) 17.19%, rgba(251, 203, 98, 0.77) 100%)",
      boxShadow:
        "inset 0px 8.97px 26.92px 0px #FFB949B2, 0px 8.97px 35.9px 0px #AF733F80",
    },
  },
  {
    id: 4,
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9aaa5d2c8a6b413398661bb7192e8400",
    name: "GPRO",
    company: "GoPro Inc.",
    ipoDate: "28th Sep -12th Oct 2024",
    listingDate: "15th Oct 2024",
    type: "EQUITY",
    sentimentScore: "0.07",
    decisionRate: "85",
    priceRange: "₹110 - ₹116",
    minQuantity: "1200",
    typeBackground: {
      background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B5C0C 132.95%)",
      border: "0.9px solid transparent", // Set border style with transparent color
      borderImageSource: `
          linear-gradient(180deg, rgba(11, 92, 12, 0.4) 17.19%, rgba(98, 251, 108, 0.77) 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(180deg, rgba(11, 92, 12, 0) -4.69%, rgba(189, 254, 191, 0.3) 100%)
        `,
      borderImageSlice: "1", // Add this for the border image to display correctly
      boxShadow: `
          0px 8.97px 26.92px 0px #49FF4FB2 inset,
          0px 8.97px 35.9px 0px #0B5C0C80
        `,
      backdropFilter: "blur(17.94871711730957px)", // Add this for backdrop blur effect
    },
  },
  {
    id: 5,
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9c90cf2594b64dae9fa151f41e7db713",
    name: "PEP",
    company: "PepsiCo Inc",
    ipoDate: "26th Sep -10th Oct 2024",
    listingDate: "14th Oct 2024",
    type: "EQUITY",
    sentimentScore: "0.07",
    decisionRate: "85",
    priceRange: "₹110 - ₹116",
    minQuantity: "1200",
    typeBackground: {
      background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #0B5C0C 132.95%)",
      border: "0.9px solid transparent", // Set border style with transparent color
      borderImageSource: `
          linear-gradient(180deg, rgba(11, 92, 12, 0.4) 17.19%, rgba(98, 251, 108, 0.77) 100%),
          linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
          linear-gradient(180deg, rgba(11, 92, 12, 0) -4.69%, rgba(189, 254, 191, 0.3) 100%)
        `,
      borderImageSlice: "1", // Add this for the border image to display correctly
      boxShadow: `
          0px 8.97px 26.92px 0px #49FF4FB2 inset,
          0px 8.97px 35.9px 0px #0B5C0C80
        `,
      backdropFilter: "blur(17.94871711730957px)", // Add this for backdrop blur effect
    },
  },
];

const ipoDetailData = [
  {
    companyName: "HYUNDAI MOTOR INDIA",
    companyDescription:
      "Hyundai Motor India, established in 1996, is a leading automobile manufacturer in India, known for its innovation and customer-centric approach. It produces a wide range of vehicles, including electric and hybrid models, serving both domestic and global markets.",
    keyObjectives: [
      {
        title: "Expand Electric Vehicle (EV) Lineup",
        description: "Increasing production and launching new EV models.",
      },
      {
        title: "Boost Manufacturing Efficiency",
        description: "Investing in AI-driven production technology.",
      },
      {
        title: "Sustainability Focus",
        description:
          "Reducing carbon emissions and expanding green energy use.",
      },
    ],
    schedule: [
      { label: "Opening Date", date: "17th Oct 2024" },
      { label: "Closing Date", date: "21th Oct 2024" },
      { label: "Basis of Allotment", date: "22th Oct 2024" },
      { label: "Initiation of Refunds", date: "23th Oct 2024" },
      { label: "Credit Shares", date: "23th Oct 2024" },
      { label: "Listing Dates", date: "24th Oct 2024" },
    ],
    advantages: [
      {
        title: "Strong Market Presence",
        description:
          "Second-largest car maker in India with a loyal customer base.",
      },
      {
        title: "Growing EV Portfolio",
        description:
          "Hyundai is focused on electric and hybrid vehicles, in line with market trends.",
      },
      {
        title: "Cutting-Edge Technology",
        description:
          "Incorporating AI and autonomous driving features in vehicles.",
      },
    ],
    disadvantages: [
      {
        title: "Dependence on ICE Vehicles",
        description:
          "A large portion of revenue still comes from traditional engine vehicles, which may face declining demand.",
      },
      {
        title: "Global Supply Chain Issues",
        description: "Susceptible to semiconductor shortages and rising costs.",
      },
    ],
  },
  {
    companyName: "McDonald’s Corp",
    companyDescription:
      "McDonald’s Corp, established in 1996, is a leading automobile manufacturer in India, known for its innovation and customer-centric approach. It produces a wide range of vehicles, including electric and hybrid models, serving both domestic and global markets.",
    keyObjectives: [
      {
        title: "Expand Electric Vehicle (EV) Lineup",
        description: "Increasing production and launching new EV models.",
      },
      {
        title: "Boost Manufacturing Efficiency",
        description: "Investing in AI-driven production technology.",
      },
      {
        title: "Sustainability Focus",
        description:
          "Reducing carbon emissions and expanding green energy use.",
      },
    ],
    schedule: [
      { label: "Opening Date", date: "17th Oct 2024" },
      { label: "Closing Date", date: "21th Oct 2024" },
      { label: "Basis of Allotment", date: "22th Oct 2024" },
      { label: "Initiation of Refunds", date: "23th Oct 2024" },
      { label: "Credit Shares", date: "23th Oct 2024" },
      { label: "Listing Dates", date: "24th Oct 2024" },
    ],
    advantages: [
      {
        title: "Strong Market Presence",
        description:
          "Second-largest car maker in India with a loyal customer base.",
      },
      {
        title: "Growing EV Portfolio",
        description:
          "Hyundai is focused on electric and hybrid vehicles, in line with market trends.",
      },
      {
        title: "Cutting-Edge Technology",
        description:
          "Incorporating AI and autonomous driving features in vehicles.",
      },
    ],
    disadvantages: [
      {
        title: "Dependence on ICE Vehicles",
        description:
          "A large portion of revenue still comes from traditional engine vehicles, which may face declining demand.",
      },
      {
        title: "Global Supply Chain Issues",
        description: "Susceptible to semiconductor shortages and rising costs.",
      },
    ],
  },
];

const suggestionCardsData = [
  {
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ffef284907f2a4bf0a335868cf2007ce9",
    category: "Sports",
    subCategory: "CRICKET",
    change: "+0.25%",
    title: "BMW SPORTS",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F441bdc029fa94bc2a826244254476776",
  },
  {
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F1578ccafd07348dba3c9ba7c7a592cf2",
    category: "Health Category",
    subCategory: "MEDICINE",
    change: "+0.41%%",
    title: "CIPLA LTD",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F441bdc029fa94bc2a826244254476776",
  },
  {
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F0a5eb213cb9b485c875a89e828ecc9d8",
    category: "Automobile",
    subCategory: "ELECTRIC VEHICLE",
    change: "+10.72%",
    title: "Tesla",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F441bdc029fa94bc2a826244254476776",
  },
  {
    logo: "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ffef284907f2a4bf0a335868cf2007ce9",
    category: "Automobile",
    subCategory: "CARS",
    change: "+1.1%",
    title: "Tesla",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F441bdc029fa94bc2a826244254476776",
  },
];

function InitialPublicOffers() {
  const [selectedOption, setSelectedOption] = useState("All");
  const [selectedIPO, setSelectedIPO] = useState(
    ipoDetailData[0]?.companyName || ""
  );
//   console.log(selectedIPO);

  const [selectedCategory, setSelectedCategory] = useState("Ongoing");
  const { theme } = useTheme();

  const options = ["All", "SME", "DEBT", "EQUITY"];
  const categories = ["Ongoing", "Upcoming", "Past"];

  // Filter the IPO data based on the selected option
  const filteredIpoData = ipoData.filter(
    (ipo) => selectedOption === "All" || ipo.type === selectedOption
  );

  const handleSelect = (company) => {
    setSelectedIPO(company);
    // console.log("Selected company:", company);
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
              {filteredIpoData.map((ipo) => (
                <IPOCard
                  key={ipo.name}
                  logo={ipo.logo}
                  name={ipo.name}
                  company={ipo.company}
                  ipoDate={ipo.ipoDate}
                  listingDate={ipo.listingDate}
                  type={ipo.type}
                  sentimentScore={ipo.sentimentScore}
                  decisionRate={ipo.decisionRate}
                  priceRange={ipo.priceRange}
                  minQuantity={ipo.minQuantity}
                  typeBackground={ipo.typeBackground}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
  
          {/* Right Side (100% for mobile, 55% for desktop) */}
          <div className="w-full lg:w-[55%] p-2 flex flex-col h-full mt-6 lg:mt-0">
            <div className="h-[10%]">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {suggestionCardsData.map((card, index) => (
                  <SuggestionCard
                    key={index}
                    logo={card.logo}
                    category={card.category}
                    subCategory={card.subCategory}
                    change={card.change}
                    title={card.title}
                    image={card.image}
                  />
                ))}
              </div>
            </div>
  
            <div className="h-[90%] mt-4">
              {selectedIPO && (
                <IPODetail
                  theme={theme}
                  ipoData={
                    ipoDetailData.length > 0
                      ? ipoDetailData.find(
                          (ipo) =>
                            selectedIPO.toLowerCase() ===
                            ipo.companyName.toLowerCase()
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
