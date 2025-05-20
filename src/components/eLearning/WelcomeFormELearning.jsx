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
      <h1 className="text-white text-2xl md:text-4xl lg:text-6xl font-bold">
        Master the Stock Market – One Lesson at a Time!
      </h1>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-7%] w-[101%] bg-white/30 backdrop-blur-lg p-6 rounded-2xl overflow-visible">
        <h1 className="font-semibold text-lg mb-6 text-left">
          Welcome to Stock Genius Learning!
        </h1>

        <div className="w-full flex flex-wrap md:flex-nowrap gap-4 md:gap-8 justify-center md:justify-between items-center">
          {Object.entries(options).map(([category, values], index) => (
            <div
              key={index}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
              <label className="block text-xs mb-2 whitespace-nowrap">
                {category === "tradingExperience" &&
                  "How familiar are you with stock trading?"}
                {category === "focusArea" && "What do you want to focus on?"}
                {category === "learningTime" &&
                  "How much time do you want to spend learning per week?"}
              </label>
              <div
      className="bg-white text-black px-3 py-1 rounded-lg flex justify-between items-center cursor-pointer border border-gray-300"
      onClick={() =>
        setOpenDropdown(openDropdown === category ? null : category)
      }
    >
      {selectedOptions[category] || "Select an option"}
      <FaChevronDown className="text-gray-500" />
    </div>

              {openDropdown === category && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-lg z-50 p-2">
                  <div className="flex flex-wrap justify-between">
                    {values.map((option, i) => (
                      <div
                        key={i}
                        className="text-xs text-black rounded-lg flex items-center cursor-pointer py-1"
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

        <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Required Fields"
        message="Please select all options before proceeding"
        onConfirm={() => setIsModalOpen(false)}
      />

        <div className="flex justify-center mt-10">
        <button
          className="px-6 md:px-16 py-1 rounded-xl text-white text-xs md:text-base"
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
