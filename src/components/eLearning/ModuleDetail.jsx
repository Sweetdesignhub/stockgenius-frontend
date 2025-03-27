import React from "react";
import { useParams } from "react-router-dom";

const moduleData = [
  {
    id: "1",
    title: "Module 1",
    content: "This is an in-depth guide to Stock Market Basics.",
  },
  {
    id: "2",
    title: "Module 2",
    content: "Here, you will learn about Derivatives in the simplest way.",
  },
  {
    id: "3",
    title: "Module 3",
    content: "Explaining Futures Contracts with real-life examples.",
  },
  {
    id: "4",
    title: "Module 4",
    content: "Understanding Options Contracts through easy-to-follow stories.",
  },
  {
    id: "5",
    title: "Module 5",
    content: "A deep dive into the Option Chain.",
  },
];

function ModuleDetail() {
  const { moduleId } = useParams();
  const module = moduleData.find((mod) => mod.id === moduleId);

  if (!module) {
    return <h1 className="text-white text-center text-2xl">Module Not Found</h1>;
  }

  return (
    <div className="w-[80%] mx-auto p-6 rounded-lg text-white bg-gray-800">
      <h1 className="text-3xl font-bold">{module.title}</h1>
      <p className="mt-4 text-lg">{module.content}</p>
    </div>
  );
}

export default ModuleDetail;
