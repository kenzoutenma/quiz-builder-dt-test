import { QuestionInput, QuestionType } from "../hooks/useQuizForm";
import { BooleanFields, InputFields, CheckboxFields } from "./QuestionTypeFields";

interface QuestionCardProps {
  question: QuestionInput;
  index: number;
  onRemove: () => void;
  onUpdate: (fields: Partial<QuestionInput>) => void;
  onAddOption: () => void;
  onOptionChange: (oIndex: number, val: string) => void;
}

export function QuestionCard({
  question,
  index,
  onRemove,
  onUpdate,
  onAddOption,
  onOptionChange,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-2.5 border-2 border-solid p-4 rounded-sm border-indigo-500">
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Question Text</legend>
        <input
          type="text"
          required
          className="input"
          placeholder="Enter question wording..."
          value={question.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Type</legend>
        <select
          value={question.type}
          className="select"
          onChange={(e) =>
            onUpdate({
              type: e.target.value as QuestionType,
              options: e.target.value === "CHECKBOX" ? [""] : [],
              correctAnswers: [],
            })
          }
        >
          <option value="BOOLEAN">True / False</option>
          <option value="INPUT">Short Text Input</option>
          <option value="CHECKBOX">Multiple Choice (Checkbox)</option>
        </select>
      </fieldset>

      {question.type === "BOOLEAN" && (
        <BooleanFields question={question} qIndex={index} onChange={onUpdate} />
      )}
      {question.type === "INPUT" && (
        <InputFields question={question} qIndex={index} onChange={onUpdate} />
      )}
      {question.type === "CHECKBOX" && (
        <CheckboxFields
          question={question}
          qIndex={index}
          onChange={onUpdate}
          onAddOption={onAddOption}
          onOptionChange={onOptionChange}
        />
      )}

      <button type="button" onClick={onRemove} className="btn btn-soft btn-error mt-2">
        Remove Question
      </button>
    </div>
  );
}