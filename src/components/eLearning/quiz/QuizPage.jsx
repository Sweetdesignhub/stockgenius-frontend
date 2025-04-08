import { useParams } from "react-router-dom";
import module1 from "./data/module1.js";
import module2 from "./data/module2.js";
import Quiz from "./Quiz";

const quizMap = {
  "1": module1, 
  "2": module2, 
};

const QuizPage = () => {
  const { moduleId } = useParams();
  const quizData = quizMap[moduleId];

  if (!quizData) return <div>Quiz not found for this module.</div>;

  return (
    <div className="p-10 bg-[#0F0D16] h-[100vh]">
      <h1 className="text-3xl font-semibold text-left mt-4 font-[poppins]"> Module {moduleId}</h1>
      <Quiz questions={quizData.questions} />
    </div>
  );
};

export default QuizPage;
