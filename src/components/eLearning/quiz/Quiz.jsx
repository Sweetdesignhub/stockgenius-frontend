import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = ({ questions }) => {
  const navigate = useNavigate();

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [showRetry, setShowRetry] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(new Set());

  useEffect(() => {
    const savedActive = localStorage.getItem("activeQuestion");
    const savedCorrect = localStorage.getItem("correctAnswers");

    if (savedActive !== null) setActiveQuestion(parseInt(savedActive, 10));
    if (savedCorrect !== null)
      setCorrectAnswers(new Set(JSON.parse(savedCorrect)));
  }, []);

  useEffect(() => {
    localStorage.setItem("activeQuestion", activeQuestion);
  }, [activeQuestion]);

  useEffect(() => {
    localStorage.setItem(
      "correctAnswers",
      JSON.stringify(Array.from(correctAnswers))
    );
  }, [correctAnswers]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const isCorrect = questions[activeQuestion].answer === selectedOption;

    if (isCorrect) {
      setPopupContent("✅ Correct! 🎉 Let's move to the next question.");
      setCorrectAnswers((prev) => new Set(prev).add(activeQuestion));
      setShowRetry(false);
    } else {
      setPopupContent("Oops! That's incorrect. Try again.");
      setShowRetry(true);
    }

    setShowPopup(true);
  };

  const handleNext = () => {
    setShowPopup(false);
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handleRetry = () => {
    setShowPopup(false);
    setSelectedOption(null);
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  const allAnswered = correctAnswers.size === questions.length;

  return (
    <div className="mt-6 px-4">
      <div className="flex space-x-4 mb-1">
        {questions.map((_, index) => {
          const isActive = activeQuestion === index;
          const isCorrect = correctAnswers.has(index);

          return (
            <button
              key={index}
              onClick={() => {
                setActiveQuestion(index);
                setSelectedOption(null);
                setShowPopup(false);
              }}
              className={`flex items-center gap-2 px-5 py-2 text-white border-b-[3px] ${
                isActive ? "border-[#623CEA]" : "border-transparent opacity-60"
              }`}
            >
              {isCorrect && <span className="text-green-400">✅</span>}
              <span className="font-[poppins]">Question {index + 1}</span>
            </button>
          );
        })}

        {allAnswered && (
          <button
            onClick={() => {
              setActiveQuestion(questions.length);
              setShowPopup(false);
            }}
            className={`flex items-center gap-2 px-5 py-2 text-white border-b-[3px] ${
              activeQuestion === questions.length
                ? "border-[#623CEA]"
                : "border-transparent opacity-60"
            }`}
          >
            🎉 <span className="font-[poppins]">Finish</span>
          </button>
        )}
      </div>

      <div className="h-0.5 bg-[#42366F] w-full mb-4" />

      <div className="px-20">
        {activeQuestion < questions.length ? (
          <>
            <div className="my-20 text-white text-lg tracking-widest font-[poppins]">
              {questions[activeQuestion].question}
            </div>

            <div className="flex flex-col items-start gap-2 mb-6 font-[poppins]">
              {questions[activeQuestion].options.map((option, index) => {
                const isSelected = selectedOption === option;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-white w-5">
                      {getOptionLabel(index)})
                    </span>
                    <div
                      onClick={() => handleOptionSelect(option)}
                      className={`cursor-pointer py-1 px-3 rounded-xl border inline-block max-w-max ${
                        isSelected
                          ? "bg-[#594B8C] text-white border-[#594B8C]"
                          : "text-white border-[#42366E]"
                      }`}
                    >
                      {option}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="bg-[#623CEA] text-white px-5 py-2 mt-28 font-[poppins] rounded-xl disabled:opacity-50"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="my-20 text-white text-xl text-left font-[poppins]">
            <h2 className="text-3xl mb-4">🏆 Well Done!</h2>
            <p className="mb-4">
              You’ve just completed Lesson 1: What is the Stock Market?
            </p>
            <p className="mb-4">
              👏 Great job taking your first step into the world of investing!
            </p>
            <p className="mb-4">
              Remember, the stock market isn’t as scary as it sounds—it’s just a
              place where people buy and sell small parts of businesses, just
              like our tea stall story.
            </p>
            <p className="mb-2">✅ Keep up the momentum.</p>
            <p className="mb-2">✅ Take a deep breath.</p>
            <p className="mb-6">
              ✅ Get ready for the next lesson where we’ll make stocks, indices,
              and derivatives super easy to understand!
            </p>
            <p className="text-lg  mb-4">
              When you're ready, click Next to continue your journey.
            </p>

            <button
              onClick={() => navigate("/e-learning/modules")}
              className="bg-[#623CEA] text-white px-6 py-2 rounded-lg mt-20"
            >
              Next Lesson |-&gt;
            </button>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed right-0 top-1/2 flex items-start ">
          <div className="bg-[#4D4D4D1A] border border-[#623CEA] text-white py-4 px-12 rounded-xl shadow-lg ">
            <p className="mb-4 font-[poppins]">{popupContent}</p>
            <div className="text-center">
              {showRetry ? (
                <button
                  onClick={handleRetry}
                  className="bg-[#EA3C3C] px-4 py-1 rounded-xl"
                >
                  Retry
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-[#2ACA42] px-4 py-1 rounded-xl"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          <img
            loading="lazy"
            src={
              showRetry
                ? "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fe95c6bbb67a54a91a3299e0e0f991b68"
                : "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F0ccfeff06de54aadacd9eb88c75d0e70"
            }
            alt={showRetry ? "Retry" : "Next"}
            className="w-96 h-96 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
