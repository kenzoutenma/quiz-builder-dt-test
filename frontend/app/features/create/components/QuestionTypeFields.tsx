import { QuestionInput } from "../hooks/useQuizForm";

interface FieldProps {
  question: QuestionInput;
  qIndex: number;
  onChange: (fields: Partial<QuestionInput>) => void;
  onAddOption?: () => void;
  onOptionChange?: (oIndex: number, val: string) => void;
}

export function BooleanFields({ question, qIndex, onChange }: FieldProps) {
  return (
    <div className="space-x-4">
      <span className="text-sm font-medium block mb-1">Correct Answer:</span>
      {["true", "false"].map((val) => (
        <label key={val} className="capitalize">
          <input
            type="radio"
            name={`boolean-${qIndex}`}
            checked={question.correctAnswers[0] === val}
            onChange={() => onChange({ correctAnswers: [val] })}
          />{" "}
          {val}
        </label>
      ))}
    </div>
  );
}

export function InputFields({ question, onChange }: FieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Correct Short Answer</legend>
      <input
        type="text"
        required
        className="input"
        placeholder="e.g., JavaScript"
        value={question.correctAnswers[0] || ""}
        onChange={(e) => onChange({ correctAnswers: [e.target.value] })}
      />
    </fieldset>
  );
}

export function CheckboxFields({ question, onChange, onAddOption, onOptionChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Options & Answers</legend>
        {question.options.map((opt, oIndex) => (
          <div key={oIndex} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="input"
              checked={question.correctAnswers.includes(opt) && opt !== ""}
              onChange={(e) => {
                const answers = e.target.checked
                  ? [...question.correctAnswers, opt]
                  : question.correctAnswers.filter((a) => a !== opt);
                onChange({ correctAnswers: answers });
              }}
            />
            <input
              type="text"
              required
              placeholder={`Option ${oIndex + 1}`}
              className="input"
              value={opt}
              onChange={(e) => onOptionChange?.(oIndex, e.target.value)}
            />
          </div>
        ))}
      </fieldset>
      <button type="button" onClick={onAddOption} className="btn btn-soft w-full">
        + Add Option
      </button>
    </div>
  );
}