import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import ModulesCard from "../../components/eLearning/ModulesCard";


// Module data
const modules = [
  {
    id: "1",
    title: "Module 1",
    description: "Introduction to Stock Market Basics (Super Simple)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F449e542a8e474ca09fb87ff0dbf82cfc",
    descColor: "#CCFDFF",
    content:
      "🚀 Learn the basics of stock market investing with real-world examples.",
  },
  {
    id: "2",
    title: "Module 2",
    description: "Understanding Derivatives (Super Simple Story)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F3636bc3d3ef1489e9bab8d4ec141ba99",
    descColor: "#D6FFF0",
    content: "📈 Understand how derivatives work and how traders use them.",
  },
  {
    id: "3",
    title: "Module 3",
    description: "What Are Futures Contracts? (Super Simple with Story)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F044f0c30f30240cb9763f0640450ef68",
    descColor: "#FFF0F0",
    content: "🔮 Explore the mechanics of futures contracts in trading.",
  },
  {
    id: "4",
    title: "Module 4",
    description: "What are Options Contracts? (Super Simple with Stories)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F48eb8037a3664f94827e5c54e88ee8f1",
    descColor: "#FFEECC",
    content: "💡 Options contracts explained in the simplest way possible!",
  },
  {
    id: "5",
    title: "Module 5",
    description: "Understanding Option Chain",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fa369009079804034898ca9186a441725",
    descColor: "#CDFFCC",
    content: "📊 Learn how to analyze an option chain like a pro.",
  },
];

function LearningTab() {
  const selectedOptions = useSelector((state) => state.learning);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Show module cards only on the main learning page */}
      {window.location.pathname === "/e-learning/learning" && (
        <>
           {/* 🔥 Top Section - Gamified Learning Header */}
       <div
         className="h-[15%] p-4 flex flex-col justify-center rounded-xl backdrop-blur-xl"
         style={{
           background:
             "linear-gradient(180deg, rgba(90, 64, 46, 0.15) 0%, rgba(51, 36, 27, 0.2) 100%), radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 99.59%)",
           boxShadow:
             "0px 30px 60px rgba(0, 0, 0, 0.4), 0px 15px 30px rgba(0, 0, 0, 0.2), 0px 0px 100px 0px #FFD9A640 inset",
         }}
       >
         <h1 className="text-white text-2xl font-semibold">
           Learn Stocks the Fun Way – Gamified, Interactive & Real!
         </h1>
         <p className="text-md text-[#FF9A00]">
           Master stock trading with step-by-step lessons, live simulations & AI-powered coaching
         </p>
       </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModulesCard
                key={module.id}
                moduleTitle={module.title}
                moduleDescription={module.description}
                bgImage={module.bgImage}
                link={module.id} // Links to /e-learning/learning/1, /e-learning/learning/2, etc.
                descColor={module.descColor}
              />
            ))}
          </div>
        </>
      )}
      {/* Render module details when a module is selected */}
      <Outlet />
    </div>
  );
}

export default LearningTab;