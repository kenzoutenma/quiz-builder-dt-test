"use client";

import { QuestionCard } from "@/app/features/create/components/QuestionCard";
import { useQuizForm } from "@/app/features/create/hooks/useQuizForm";

export default function CreateQuizPage() {
  const {
    title,
    setTitle,
    questions,
    error,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    updateOption,
    handleSubmit,
  } = useQuizForm();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Create New Quiz
      </h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Quiz Title</legend>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g., JavaScript Basics"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </fieldset>

        <div className="divider">Questions</div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <QuestionCard
              key={index}
              question={q}
              index={index}
              onRemove={() => removeQuestion(index)}
              onUpdate={(fields) => updateQuestion(index, fields)}
              onAddOption={() => addOption(index)}
              onOptionChange={(oIndex, val) => updateOption(index, oIndex, val)}
            />
          ))}
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button type="button" onClick={addQuestion} className="btn">
            + Add Question
          </button>
          <button type="submit" className="btn btn-primary">
            Save & Publish Quiz
          </button>
        </div>
      </form>
    </div>
  );
}