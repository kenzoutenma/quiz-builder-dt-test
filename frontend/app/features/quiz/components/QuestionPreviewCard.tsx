import { Question } from "../hooks/useQuizDetail";
import { BooleanPreview, InputPreview, CheckboxPreview } from "./QuestionPreviewFields";

interface CardProps {
  question: Question;
  index: number;
}

export function QuestionPreviewCard({ question, index }: CardProps) {
  return (
    <div className="p-5 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold">Question {index + 1}</span>
        <span className="text-xs uppercase px-2 py-0.5 rounded font-mono bg-gray-100 text-gray-700">
          {question.type}
        </span>
      </div>

      <p className="text-lg mb-4 text-gray-900">{question.text}</p>

      <div className="pointer-events-none opacity-70 space-y-2">
        {question.type === "BOOLEAN" && <BooleanPreview question={question} />}
        {question.type === "INPUT" && <InputPreview question={question} />}
        {question.type === "CHECKBOX" && <CheckboxPreview question={question} />}
      </div>
    </div>
  );
}