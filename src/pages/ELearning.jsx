import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import WelcomeFormELearning from "../components/eLearning/WelcomeFormELearning";

function ELearning() {
  const [selectedOptions, setSelectedOptions] = useState({
    tradingExperience: "",
    focusArea: "",
    learningTime: "",
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const options = {
    tradingExperience: ["Beginner", "Intermediate", "Expert"],
    focusArea: ["Stocks", "Options", "Futures", "All"],
    learningTime: ["5 min", "15 min", "30 min+"],
  };

  const handleSelection = (category, option) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
    setOpenDropdown(null); // Close dropdown after selection
  };

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        {/* Background Images */}
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[100px] md:w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F87dfd2fd4eea4f378d9e578d4c5dd7d0"
          alt="bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[100px] md:w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9815d9f59dfd4f65b9e50d5dcbb0152c"
          alt="bear"
        />

        <div className="bg-white min-h-[85vh] md:max-h-[85vh] news-table rounded-2xl py-2 px-4 flex flex-col gap-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg mb-4 lg:mb-0 lg:mr-4 text-center md:text-left">
              Welcome to Stock Genius Learning!
            </h1>
          </div>

          {/* Video Background Section */}
          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-visible">
            {/* Video Background */}
            <video
              src="https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F1e0c9b2406b24921b2488132ff4030a5%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=1e0c9b2406b24921b2488132ff4030a5&alt=media&optimized=true"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              autoPlay
              loop
              muted
            />

            {/* Welcome ELearning Component */}
          <WelcomeFormELearning
            options={options}
            selectedOptions={selectedOptions}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            handleSelection={handleSelection}
          />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ELearning;
