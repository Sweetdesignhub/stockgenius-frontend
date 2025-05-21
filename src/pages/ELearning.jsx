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
  <div className="-z-10 w-full">
    <div className="min-h-screen px-2 sm:px-4 md:px-6 lg:px-32 relative">
      {/* Background Images with responsive sizes */}
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0 w-[80px] sm:w-[100px] md:w-[135px] lg:w-[165px] transition-all duration-300"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F87dfd2fd4eea4f378d9e578d4c5dd7d0"
        alt="bull"
      />
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0 w-[80px] sm:w-[100px] md:w-[135px] lg:w-[160px] transition-all duration-300"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9815d9f59dfd4f65b9e50d5dcbb0152c"
        alt="bear"
      />

      <div className="bg-white min-h-[105vh] md:min-h-[90vh] lg:min-h-[90vh] md:max-h-[120vh] news-table rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col gap-1 sm:gap-2 md:gap-3">
        {/* Header + Dropdowns with responsive layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 py-10 sm:py-3 border-[#FFFFFF1A]">
          <h1 className="font-semibold text-base sm:text-lg text-center sm:text-left w-full sm:w-auto mb-2 sm:mb-0">
            {getHeaderTitle(location.pathname)}
          </h1>

          {/* Responsive dropdowns */}
          {isLearningDashboard && (
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              {Object.entries(learningPreferences).map(([category, value], i) => (
                <div key={i} className="relative w-full sm:w-[125px]">
        
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
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-lg sm:rounded-xl md:rounded-2xl overflow-visible">{/* Video Background */}
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
            <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 px-2 mt-4 md:mt-0">
              <Outlet />
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ELearning;
