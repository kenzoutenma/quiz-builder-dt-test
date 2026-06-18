import { Question } from "../hooks/useQuizDetail";

interface FieldProps {
  question: Question;
}

export function BooleanPreview({ question }: FieldProps) {
  return (
    <div className="flex space-x-4 text-sm">
      {["true", "false"].map((val) => (
        <label key={val} className="flex items-center space-x-2 capitalize">
          <input
            type="radio"
            checked={question.correctAnswers.includes(val)}
            readOnly
          />
          <span>{val}</span>
        </label>
      ))}
    </div>
  );
}

export function InputPreview({ question }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1">Expected Answer Value:</label>
      <input
        type="text"
        className="border p-2 rounded w-full bg-gray-50"
        value={question.correctAnswers[0] || ""}
        readOnly
      />
    </div>
  );
}

export function CheckboxPreview({ question }: FieldProps) {
  if (!question.options) return null;

  return (
    <div className="space-y-1">
      {question.options.map((option, oIdx) => (
        <label key={oIdx} className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={question.correctAnswers.includes(option)}
            readOnly
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}