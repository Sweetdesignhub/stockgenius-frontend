import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../config";
import YesNoConfirmationModal from "../../common/YesNoConfirmationModal";

const Quiz = ({ questions }) => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);

  console.log("Inside QuizPage, moduleId:", moduleId);

  const userId =
    useSelector((state) => state.user?.currentUser?.id) || "defaultUserId";
  console.log("User ID:", userId);

  const [quizProgress, setQuizProgress] = useState([]);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [showRetry, setShowRetry] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(new Set());

  useEffect(() => {
    const fetchQuizProgress = async () => {
      try {
        const response = await api.get(
          `/api/v1/e-learning/quiz-progress/${userId}/${moduleId}`
        );
        console.log("Quiz progress response:", response.data);

        const isCompleted = response.data.isCompleted;
        const allCorrect = response.data.completedQuestions || [];

        console.log("All questions marked as correct:", allCorrect);

        setCorrectAnswers(new Set(allCorrect));
        if (isCompleted) setActiveQuestion(questions.length); // Skip to final/completion screen
        console.log("Is this module already completed?", isCompleted);
      } catch (error) {
        console.error("Error fetching quiz progress:", error);
      }
    };

    if (userId !== "defaultUserId") {
      fetchQuizProgress();
    }
  }, [userId, moduleId]);

  const handleNavigateBack = () => {
    navigate(`/e-learning/learning/${moduleId}`);
  };

  // Module-specific completion messages
  const completionMessages = {
    1: {
      title: "Module 1: Introduction to Stock Market Basics",
      extra:
        "Remember, the stock market isn’t as scary as it sounds—it’s just a place where people buy and sell small parts of businesses, just like our tea stall story.",
    },
    2: {
      title: "Module 2: Understanding Derivatives",
      extra: "You’ve now grasped how derivatives work—pretty cool, right?",
    },
    3: {
      title: "Module 3: What Are Futures Contracts?",
      extra:
        "Great job understanding futures trading! Just like Rahul's sugar deal, you now know how traders can lock in prices for future transactions.",
    },
    4: {
      title: "Module 4: What are Options Contracts?",
      extra:
        "Well done! You've mastered the basics of Call and Put options. Remember, just like Rahul's tea stall example, options give you the right but not the obligation to trade.",
    },
    5: {
      title: "Module 5: Understanding Option Chain",
      extra:
        "Congratulations! You now understand both the opportunities and risks in options trading. Remember to always trade wisely and use protective strategies like our tea stall examples!",
    },
    // Add more modules as needed
  };

  // useEffect(() => {
  //   const savedActive = localStorage.getItem("activeQuestion");
  //   const savedCorrect = localStorage.getItem("correctAnswers");

  //   if (savedActive !== null) setActiveQuestion(parseInt(savedActive, 10));
  //   if (savedCorrect !== null)
  //     setCorrectAnswers(new Set(JSON.parse(savedCorrect)));
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("activeQuestion", activeQuestion);
  // }, [activeQuestion]);

  // useEffect(() => {
  //   localStorage.setItem(
  //     "correctAnswers",
  //     JSON.stringify(Array.from(correctAnswers))
  //   );
  // }, [correctAnswers]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    const isCorrect = questions[activeQuestion].answer === selectedOption;

    if (isCorrect) {
      const newCorrectAnswers = new Set(correctAnswers).add(activeQuestion);
      setCorrectAnswers(newCorrectAnswers);

      try {
        await api.post(
          `/api/v1/e-learning/quiz-progress/${userId}/${moduleId}`,
          {
            completedQuestions: [activeQuestion],
          }
        );
        console.log("📬 Updated question progress for user:", userId);
      } catch (err) {
        console.error("❌ Failed to update question progress:", err);
      }

      // Check if this was the last question
      if (newCorrectAnswers.size === questions.length) {
        setActiveQuestion(questions.length); // Move to completion tab
        setShowPopup(false); // Skip popup
      } else {
        setPopupContent("✅ Correct! 🎉 Let's move to the next question.");
        setShowRetry(false);
        setShowPopup(true);
      }
    } else {
      setPopupContent("Oops! That's incorrect. Try again.");
      setShowRetry(true);
      setShowPopup(true);
    }

    setSelectedOption(null); // Reset selection
  };

  const handleNext = () => {
    setShowPopup(false);
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const handleRetry = () => {
    setShowPopup(false);
    setSelectedOption(null);
  };

  const handleResetQuiz = async () => {
    setYesNoModalOpen(false);
    try {
      await api.delete(
        `/api/v1/e-learning/quiz-progress/${userId}/${moduleId}`
      );
      console.log("🧹 Quiz reset successful");
      setCorrectAnswers(new Set());
      setActiveQuestion(0);
    } catch (err) {
      console.error("❌ Failed to reset quiz:", err);
    }
  };

  const handleNextLesson = () => {
    const moduleOrder = ["1", "2", "3", "4", "5"];
    const currentIndex = moduleOrder.indexOf(moduleId);
    if (currentIndex < moduleOrder.length - 1) {
      const nextModuleId = moduleOrder[currentIndex + 1];
      navigate(`/e-learning/learning/${nextModuleId}`);
    } else {
      navigate("/e-learning/learning");
    }
    localStorage.removeItem("activeQuestion");
    localStorage.removeItem("correctAnswers");
  };

  const getOptionLabel = (index) => String.fromCharCode(65 + index);

  const allAnswered = correctAnswers.size === questions.length;

  return (
    <div className="mt-6 px-2 md:px-4">
      {/* Question Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-4 justify-end">
        <button
          onClick={() => setYesNoModalOpen(true)}
          className="bg-[#623CEA] text-white px-4 md:px-5 py-2 font-[poppins] rounded-xl disabled:opacity-50 text-sm md:text-base"
          disabled={correctAnswers.size === 0}
        >
          Reset Quiz
        </button>
        <button
          onClick={handleNavigateBack}
          className="bg-[#623CEA] text-white px-4 md:px-5 py-2  font-[poppins] rounded-xl disabled:opacity-50 text-sm md:text-base"
        >
          Back
        </button>
      </div>
      <div className="flex flex-wrap gap-2 md:space-x-4 mb-1">
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
              className={`flex items-center gap-2 px-3 py-1 md:px-5 md:py-2 text-white border-b-[3px] text-sm md:text-base ${
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
            className={`flex items-center gap-2 px-3 py-1 md:px-5 md:py-2 text-white border-b-[3px] text-sm md:text-base ${
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

      {/* Quiz Content */}
      <div className="px-4 md:px-20">
        {activeQuestion < questions.length ? (
          <>
            <div className="my-10 md:my-20 text-white text-base md:text-lg tracking-wider md:tracking-widest font-[poppins]">
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
                      className={`cursor-pointer py-1 px-2 md:px-3 rounded-xl border inline-block max-w-max text-sm md:text-base ${
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
              className="bg-[#623CEA] text-white px-4 md:px-5 py-2 mt-10 md:mt-28 font-[poppins] rounded-xl disabled:opacity-50 text-sm md:text-base"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="my-10 md:my-20 text-white text-lg md:text-xl text-left font-[poppins]">
            <h2 className="text-2xl md:text-3xl mb-4">🏆 Well Done!</h2>
            <p className="mb-4 text-sm md:text-base">
              You’ve just completed{" "}
              {completionMessages[moduleId]?.title || `Module ${moduleId}`}!
            </p>
            <p className="mb-4 text-sm md:text-base">
              👏 Great job taking your first step into the world of investing!
            </p>
            <p className="mb-4 text-sm md:text-base">
              {completionMessages[moduleId]?.extra ||
                "Get ready for more exciting lessons ahead!"}
            </p>
            <p className="mb-2 text-sm md:text-base">
              ✅ Keep up the momentum.
            </p>
            <p className="mb-2 text-sm md:text-base">✅ Take a deep breath.</p>
            <p className="mb-6 text-sm md:text-base">
              ✅ Get ready for the next lesson where we’ll make stocks, indices,
              and derivatives super easy to understand!
            </p>
            <p className="text-base md:text-lg mb-4">
              When you're ready, click Next to continue your journey.
            </p>

            <button
              onClick={handleNextLesson}
              className="bg-[#623CEA] text-white px-4 md:px-6 py-2 rounded-lg mt-10 md:mt-20 text-sm md:text-base"
            >
              Next Lesson
            </button>
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 lg:right-0 lg:top-1/2 flex items-center lg:items-start justify-center lg:justify-end p-4 lg:p-0 z-50">
          <div
            className="fixed inset-0 bg-black/70 lg:hidden"
            onClick={() => setShowPopup(false)}
          />
          <div className="relative bg-[#0F0D16] lg:bg-[#4D4D4D1A] border border-[#623CEA] text-white py-4 lg:py-4 px-6 lg:px-12 rounded-xl shadow-lg w-[90%] lg:w-auto max-w-md mx-auto lg:mx-0">
            <p className="mb-4 font-[poppins] text-center text-base lg:text-lg leading-relaxed">
              {popupContent}
            </p>
            <div className="text-center">
              {showRetry ? (
                <button
                  onClick={handleRetry}
                  className="bg-[#EA3C3C] px-6 lg:px-8 py-2 rounded-xl text-base lg:text-lg hover:bg-[#d63535] transition-colors"
                >
                  Retry
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-[#2ACA42] px-6 lg:px-8 py-2 rounded-xl text-base lg:text-lg hover:bg-[#25b63b] transition-colors"
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
            className="hidden lg:block w-96 h-96 object-contain"
          />
        </div>
      )}

      <YesNoConfirmationModal
        isOpen={isYesNoModalOpen}
        onClose={() => setYesNoModalOpen(false)}
        title="Reset Quiz"
        message={`Are you sure you want to reset the quiz and lose all your progress?`}
        onConfirm={handleResetQuiz}
      />
    </div>
  );
};

export default Quiz;
