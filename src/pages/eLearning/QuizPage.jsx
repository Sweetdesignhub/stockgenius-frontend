import { useParams } from "react-router-dom";
import module1 from "../../components/eLearning/quiz/data/module1.js";
import module2 from "../../components/eLearning/quiz/data/module2.js";
import Quiz from "../../components/eLearning/quiz/Quiz.jsx";

const quizMap = {
  1: module1,
  2: module2,
};

const QuizPage = () => {
  const { moduleId } = useParams();
  const quizData = quizMap[moduleId];

  if (!quizData)
    return (
      <div className="text-white p-4 md:p-10">Quiz not found for this module.</div>
    );

  return (
    <div className="p-4 md:p-10 bg-[#0F0D16] min-h-[100vh]">
      <h1 className="text-2xl md:text-3xl font-semibold text-left mt-4 text-white font-[poppins]">
        Module {moduleId} Quiz
      </h1>
      <Quiz questions={quizData.questions} />
    </div>
  );
};

export default QuizPage;