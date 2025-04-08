import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateLearningPreferences } from "../redux/eLearning/learningSlice.js";
import WelcomeFormELearning from "../components/eLearning/WelcomeFormELearning";
import Sidebar from "../components/eLearning/Sidebar";

function ELearning() {
  const location = useLocation();
  const dispatch = useDispatch();
  const learningPreferences = useSelector((state) => state.learning);
  const [openDropdown, setOpenDropdown] = useState(null);

  const isWelcomePage = location.pathname === "/e-learning";
  const isLearningDashboard = location.pathname === "/e-learning/learning";

  const getHeaderTitle = (path) => {
    if (path === "/e-learning") return "Welcome to Stock Genius Learning!";
    if (path === "/e-learning/learning") return "Learning Dashboard";
    if (path.includes("module")) return "Your Learning Modules";
    if (path.includes("quiz")) return "Quiz Time!";
    if (path.includes("progress")) return "Your Progress Report";
    return "Explore Stock Genius";
  };

  const options = {
    tradingExperience: ["Beginner", "Intermediate", "Expert"],
    focusArea: ["Stocks", "Options", "Futures", "All"],
    learningTime: ["5 min", "15 min", "30 min+"],
  };

  const handleSelection = (category, option) => {
    dispatch(updateLearningPreferences({ category, value: option }));
    setOpenDropdown(null);
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
          {/* Header + Dropdowns */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg text-center md:text-left">
              {getHeaderTitle(location.pathname)}
            </h1>

            {/* Show dropdowns only on Learning Dashboard */}
            {isLearningDashboard && (
              <div className="flex gap-2 mt-2 md:mt-0">
                {Object.entries(learningPreferences).map(([category, value], i) => (
                  <div key={i} className="relative w-[125px]">
                    <div
                      className="px-3 py-1 rounded-2xl flex justify-between items-center cursor-pointer border text-sm bg-white"
                      style={{
                        color:
                          category === "tradingExperience"
                            ? "#FF9400"
                            : category === "focusArea"
                            ? "#14AE5C"
                            : "#4882F3",
                        borderColor:
                          category === "tradingExperience"
                            ? "#FF9400"
                            : category === "focusArea"
                            ? "#14AE5C"
                            : "#4882F3",
                      }}
                      onClick={() =>
                        setOpenDropdown(openDropdown === category ? null : category)
                      }
                    >
                      {value || "Select"} <FaChevronDown />
                    </div>

                    {openDropdown === category && (
                      <div className="absolute w-full bg-white border shadow-lg rounded-lg p-2 z-50">
                        {options[category].map((option, j) => (
                          <div
                            key={j}
                            className="cursor-pointer px-2 py-1 text-black hover:bg-gray-100 text-sm"
                            onClick={() => handleSelection(category, option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          {isWelcomePage ? (
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-visible">
              {/* Video Background */}
              <video
                src="https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F1e0c9b2406b24921b2488132ff4030a5%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=1e0c9b2406b24921b2488132ff4030a5&alt=media&optimized=true"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
                autoPlay
                loop
                muted
              />
              <WelcomeFormELearning />
            </div>
          ) : (
            <div className="flex">
              <Sidebar />
              <div className="flex-1 px-2">
                <Outlet /> {/* Dynamic content via routing */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ELearning;
