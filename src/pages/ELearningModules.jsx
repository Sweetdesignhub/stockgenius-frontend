import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateLearningPreferences } from "../redux/eLearning/learningSlice.js";
import Sidebar from "../components/eLearning/Sidebar.jsx";
import ModuleContent from "../components/eLearning/ModuleContent.jsx";
import Sample from "../components/eLearning/Sample.jsx";

function ELearningModules() {
  const dispatch = useDispatch();

  // ✅ Get saved preferences from Redux
  const learningPreferences = useSelector((state) => state.learning);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [selectedComponent, setSelectedComponent] = useState("stories");

  // ✅ Options for selection
  const options = {
    tradingExperience: ["Beginner", "Intermediate", "Expert"],
    focusArea: ["Stocks", "Options", "Futures", "All"],
    learningTime: ["5 min", "15 min", "30 min+"],
  };

  // ✅ Define text colors for each category (for dropdown & selected values)
  const categoryStyles = {
    tradingExperience: "#FF9400", // Orange
    focusArea: "#14AE5C", // Green
    learningTime: "#4882F3", // Blue
  };

  // ✅ Handle updates directly in Redux
  const handleSelection = (category, option) => {
    dispatch(updateLearningPreferences({ category, value: option }));
    setOpenDropdown(null);
  };

   // Sidebar click handler
   const handleSidebarSelection = (key) => {
    setSelectedComponent(key);
  };

  // Component mapping based on selected icon
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "stories":
        return <ModuleContent />;
      case "medal":
        return <Sample/>
      case "trophy":
        return <Sample/>
      case "library":
        return <Sample/>
      case "group":
        return <Sample/>
      default:
        return <Sample/>
    }
  };

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        <div className="bg-white min-h-[85vh] md:max-h-[85vh] news-table rounded-2xl py-2 px-4 flex flex-col gap-4">
          {/* Header Row */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg">Learning Dashboard</h1>

            {/* Dropdowns - Positioned in Same Row */}
            <div className="flex gap-2">
              {Object.entries(learningPreferences).map(
                ([category, value], i) => {
                  const textColor = categoryStyles[category]; // Get specific text color

                  return (
                    <div key={i} className="relative w-[125px]">
                      {/* Selected Option Box */}
                      <div
                        className="px-3 py-1 rounded-2xl flex justify-between items-center cursor-pointer border text-sm bg-white"
                        style={{ color: textColor, borderColor: textColor }}
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === category ? null : category
                          )
                        }
                      >
                        {value || "Select"}
                        <FaChevronDown style={{ color: textColor }} />{" "}
                        {/* Down arrow color */}
                      </div>

                      {/* Dropdown Options - Same Color as Category */}
                      {openDropdown === category && (
                        <div
                          className="absolute w-full bg-white border shadow-lg rounded-lg p-2 z-50"
                          style={{ borderColor: textColor }}
                        >
                          {options[category].map((option, j) => (
                            <div
                              key={j}
                              className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-sm"
                              style={{ color: textColor }} // ✅ Dropdown text matches category
                              onClick={() => handleSelection(category, option)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="flex mt-4 h-[85vh] gap-6">
           {/* Pass click handler to Sidebar */}
           <Sidebar onSelect={handleSidebarSelection} />
            {renderSelectedComponent()} {/* Dynamically Rendered Component */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default ELearningModules;
