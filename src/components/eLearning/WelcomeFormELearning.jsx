import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLearningPreferences,
  updateLearningPreferences,
} from "../../redux/eLearning/learningSlice";
import ConfirmationModal from "../common/ConfirmationModal";

function WelcomeFormELearning() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Initialize with empty object instead of pre-selected values
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedOptions = useSelector((state) => state.learning || {});

  const [openDropdown, setOpenDropdown] = useState(null);

  const options = {
    tradingExperience: ["Beginner", "Intermediate", "Expert"],
    focusArea: ["Stocks", "Options", "Futures", "All"],
    learningTime: ["5 min", "15 min", "30 min+"],
  };

  const handleSelection = (category, option) => {
    // Add this check to toggle selection
    const newValue = selectedOptions[category] === option ? '' : option;
    dispatch(updateLearningPreferences({ category, value: newValue }));
    setOpenDropdown(null);
  };

  const areAllOptionsSelected = () => {
    return (
      selectedOptions.tradingExperience &&
      selectedOptions.focusArea &&
      selectedOptions.learningTime
    );
  };

const handleSubmit = () => {
    if (areAllOptionsSelected()) {
      dispatch(setLearningPreferences(selectedOptions));
      navigate("/e-learning/learning");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
  <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8">
    {/* Responsive hero title */}
    <h1 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-center md:text-left">
      Master the Stock Market – One Lesson at a Time!
    </h1>

    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 md:bottom-[-10%] w-[100%] bg-white/30 backdrop-blur-lg p-4 sm:p-6 rounded-2xl">
      <h1 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-left">
        Welcome to Stock Genius Learning!
      </h1>

      {/* Responsive grid layout */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
        {Object.entries(options).map(([category, values], index) => (
          <div
            key={index}
            className="relative w-full"
          >
            <label className="block text-xs mb-2 whitespace-normal sm:whitespace-nowrap">
              {category === "tradingExperience" &&
                "How familiar are you with stock trading?"}
              {category === "focusArea" && "What do you want to focus on?"}
              {category === "learningTime" &&
                "How much time do you want to spend learning per week?"}
            </label>
            <div
              className="bg-white text-black px-3 py-2 sm:py-1 rounded-lg flex justify-between items-center cursor-pointer border border-gray-300"
              onClick={() =>
                setOpenDropdown(openDropdown === category ? null : category)
              }
            >
              <span className="text-sm sm:text-base">
                {selectedOptions[category] || "Select an option"}
              </span>
              <FaChevronDown className="text-gray-500" />
            </div>

            {openDropdown === category && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-lg z-50 p-2">
                <div className="flex flex-col sm:flex-row flex-wrap justify-between">
                  {values.map((option, i) => (
                    <div
                      key={i}
                      className="text-xs sm:text-sm text-black rounded-lg flex items-center cursor-pointer py-2 sm:py-1"
                      onClick={() => handleSelection(category, option)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOptions[category] === option}
                        className="mr-2"
                        readOnly
                      />
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Keep existing modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Required Fields"
        message="Please select all options before proceeding"
        onConfirm={() => setIsModalOpen(false)}
      />

      {/* Responsive submit button */}
      <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
        <button
          className="w-full sm:w-auto px-4 sm:px-6 md:px-16 py-2 sm:py-1 rounded-xl text-white text-xs md:text-base"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #885627 132.95%)",
            boxShadow:
              "0px 10px 30px 0px #FFA049B2 inset, 0px 10px 40px 0px #AF823F80",
            backdropFilter: "blur(20px)",
          }}
          onClick={handleSubmit}
          aria-label="Submit learning preferences"
          title={
            !areAllOptionsSelected()
              ? "Please select all options before proceeding"
              : "Submit learning preferences"
          }
        >
          Submit
        </button>
      </div>
    </div>
  </div>
);
}

export default WelcomeFormELearning;
