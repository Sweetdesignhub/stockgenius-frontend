import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { updateLearningPreferences } from "../redux/eLearning/learningSlice.js";
import Sidebar from "../components/eLearning/Sidebar.jsx";
import ModuleContent from "../components/eLearning/ModuleContent.jsx";
import ModuleDetails from "../components/eLearning/ModuleDetails.jsx";

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
    videos: [
      {
        title: "Scence 1 (1)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F6a940b51a6ac498d8381e0f9fc0eae3f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=6a940b51a6ac498d8381e0f9fc0eae3f&alt=media&optimized=true",
      },
      {
        title: "section before lesson (2)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Ffa41c1476acf408280d90818bb99b08f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=fa41c1476acf408280d90818bb99b08f&alt=media&optimized=true",
      },
      {
        title: "lesson 1 (3)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fdaf30f7efd8c4eaa99139edbad372b5f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=daf30f7efd8c4eaa99139edbad372b5f&alt=media&optimized=true",
      },
      {
        title: "filler 2 (4)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F9944509d1a06489195b104db24540fcb%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=9944509d1a06489195b104db24540fcb&alt=media&optimized=true",
      },
      {
        title: "lesson 2 (5)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F5ad366a3f3fa4f819ba306b2f86c3309%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=5ad366a3f3fa4f819ba306b2f86c3309&alt=media&optimized=true",
      },
      {
        title: "filler 3 (6)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fc84ab01f393e4a6f9cb5c907659e86e5%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=c84ab01f393e4a6f9cb5c907659e86e5&alt=media&optimized=true",
      },
      {
        title: "lesson 3 (7)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F97f5f74f2aa04f46b33224ff16838442%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=97f5f74f2aa04f46b33224ff16838442&alt=media&optimized=true",
      },
      {
        title: "filler 3 & 4 (8)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F0916f029773c443fa71981cf228357a9%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=0916f029773c443fa71981cf228357a9&alt=media&optimized=true",
      },
      {
        title: "lesson 4 (9)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F829eba082e2d4435864352c9c269f528%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=829eba082e2d4435864352c9c269f528&alt=media&optimized=true",
      },
      {
        title: "after lesson 4 (10)",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F5e8cb89c8bff4b9d95d249056c6bdebd%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=5e8cb89c8bff4b9d95d249056c6bdebd&alt=media&optimized=true",
      },
    ],
  },
  {
    id: "2",
    title: "Module 2",
    description: "Understanding Derivatives (Super Simple Story)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F3636bc3d3ef1489e9bab8d4ec141ba99",
    descColor: "#D6FFF0",
    content: "📈 Understand how derivatives work and how traders use them.",
    videos: [
      {
        title: "video 1, module 2",
        url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2F63118228763d4f0a9166324cf0caa748%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=63118228763d4f0a9166324cf0caa748&alt=media&optimized=true",
      },
    ],
  },
  {
    id: "3",
    title: "Module 3",
    description: "What Are Futures Contracts? (Super Simple with Story)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F044f0c30f30240cb9763f0640450ef68",
    descColor: "#FFF0F0",
    content: "🔮 Explore the mechanics of futures contracts in trading.",
    // videos: [
    //   { title: "Scence 1", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fd1e1aa8aad394984ba79c72c4ecb6662%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=d1e1aa8aad394984ba79c72c4ecb6662&alt=media&optimized=true" },
    //   { title: "section before lesson", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Ffa41c1476acf408280d90818bb99b08f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=fa41c1476acf408280d90818bb99b08f&alt=media&optimized=true" },
    // ]
  },
  {
    id: "4",
    title: "Module 4",
    description: "What are Options Contracts? (Super Simple with Stories)",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F48eb8037a3664f94827e5c54e88ee8f1",
    descColor: "#FFEECC",
    content: "💡 Options contracts explained in the simplest way possible!",
    // videos: [
    //   { title: "Scence 1", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fd1e1aa8aad394984ba79c72c4ecb6662%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=d1e1aa8aad394984ba79c72c4ecb6662&alt=media&optimized=true" },
    //   { title: "section before lesson", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Ffa41c1476acf408280d90818bb99b08f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=fa41c1476acf408280d90818bb99b08f&alt=media&optimized=true" },
    // ]
  },
  {
    id: "5",
    title: "Module 5",
    description: "Understanding Option Chain",
    bgImage:
      "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fa369009079804034898ca9186a441725",
    descColor: "#CDFFCC",
    content: "📊 Learn how to analyze an option chain like a pro.",
    // videos: [
    //   { title: "Scence 1", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Fd1e1aa8aad394984ba79c72c4ecb6662%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=d1e1aa8aad394984ba79c72c4ecb6662&alt=media&optimized=true" },
    //   { title: "section before lesson", url: "https://cdn.builder.io/o/assets%2F462dcf177d254e0682506e32d9145693%2Ffa41c1476acf408280d90818bb99b08f%2Fcompressed?apiKey=462dcf177d254e0682506e32d9145693&token=fa41c1476acf408280d90818bb99b08f&alt=media&optimized=true" },
    // ]
  },
];

function ELearningModules() {
  const dispatch = useDispatch();
  const learningPreferences = useSelector((state) => state.learning);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("stories");
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);

  const options = {
    tradingExperience: ["Beginner", "Intermediate", "Expert"],
    focusArea: ["Stocks", "Options", "Futures", "All"],
    learningTime: ["5 min", "15 min", "30 min+"],
  };

  const handleSelection = (category, option) => {
    dispatch(updateLearningPreferences({ category, value: option }));
    setOpenDropdown(null);
  };

  const handleModuleSelect = (module) => {
    const index = modules.findIndex((m) => m.id === module.id);
    setSelectedModuleIndex(index);
  };

  const handleBackToModuleList = () => {
    setSelectedModuleIndex(null);
  };

  const handleBack = () => {
    if (selectedModuleIndex > 0) {
      setSelectedModuleIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedModuleIndex < modules.length - 1) {
      setSelectedModuleIndex((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   const savedIndex = localStorage.getItem("selectedModuleIndex");
  //   if (savedIndex !== null) {
  //     setSelectedModuleIndex(parseInt(savedIndex, 10));
  //     localStorage.removeItem("selectedModuleIndex");
  //   }
  // }, []);

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        <div className="bg-white min-h-[85vh] md:max-h-[85vh] news-table rounded-2xl py-2 px-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between border-b-2 py-2 border-[#FFFFFF1A]">
            <h1 className="font-semibold text-lg">Learning Dashboard</h1>

            {/* Dropdowns */}
            <div className="flex gap-2">
              {Object.entries(learningPreferences).map(
                ([category, value], i) => (
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
                        setOpenDropdown(
                          openDropdown === category ? null : category
                        )
                      }
                    >
                      {value || "Select"}
                      <FaChevronDown />
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
                )
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex mt-4 h-[85vh] gap-6">
            <Sidebar onSelect={setSelectedComponent} />

            <div className="flex-1">
              {selectedComponent === "stories" ? (
                selectedModuleIndex !== null ? (
                  <ModuleDetails
                    module={modules[selectedModuleIndex]}
                    onBack={handleBack}
                    onNext={handleNext}
                    onReturnToList={handleBackToModuleList}
                    currentIndex={selectedModuleIndex}
                    totalModules={modules.length}
                  />
                ) : (
                  <ModuleContent onModuleSelect={handleModuleSelect} />
                )
              ) : (
                <div className="text-lg text-gray-500 p-6">
                  Coming Soon: {selectedComponent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ELearningModules;
