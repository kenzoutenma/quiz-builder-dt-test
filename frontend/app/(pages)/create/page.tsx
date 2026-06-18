"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

interface QuestionInput {
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: string[];
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { text: "", type: "BOOLEAN", options: [], correctAnswers: [] },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", type: "BOOLEAN", options: [], correctAnswers: [] },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, fields: Partial<QuestionInput>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...fields };
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = val;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedQuestions = questions.map((q) => {
      if (q.type === "BOOLEAN") {
        return { text: q.text, type: q.type, correctAnswers: q.correctAnswers };
      }
      if (q.type === "INPUT") {
        return { text: q.text, type: q.type, correctAnswers: q.correctAnswers };
      }
      return q;
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions: formattedQuestions }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create quiz");
      }

      router.push("/quizzes");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Create New Quiz
      </h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Quiz Title</legend>
            <input type="text" required className="input" placeholder="e.g., JavaScript Basics" onChange={(e) => setTitle(e.target.value)} value={title} />
          </fieldset>
        </div>

        <div className="flex w-full flex-col">
          <div className="divider">Questions</div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Questions</h2>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="flex flex-col gap-2.5 border-2 border-solid p-4 rounded-sm border-indigo-500" >
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Question Text</legend>
                <input type="text" required className="input" placeholder="e.g., JavaScript Basics" value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, { text: e.target.value })} />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Type</legend>
                <select value={q.type}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, {
                      type: e.target.value as QuestionType,
                      options: e.target.value === "CHECKBOX" ? [""] : [],
                      correctAnswers: [],
                    })
                  } className="select">
                  <option value="BOOLEAN">True / False</option>
                  <option value="INPUT">Short Text Input</option>
                  <option value="CHECKBOX">Multiple Choice (Checkbox)</option>
                </select>
              </fieldset>

              {q.type === "BOOLEAN" && (
                <div className="space-x-4">
                  <span className="text-sm font-medium block mb-1">Correct Answer:</span>
                  <label>
                    <input
                      type="radio"
                      name={`boolean-${qIndex}`}
                      checked={q.correctAnswers[0] === "true"}
                      onChange={() => handleQuestionChange(qIndex, { correctAnswers: ["true"] })}
                    />{" "}
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`boolean-${qIndex}`}
                      checked={q.correctAnswers[0] === "false"}
                      onChange={() => handleQuestionChange(qIndex, { correctAnswers: ["false"] })}
                    />{" "}
                    False
                  </label>
                </div>
              )}

              {q.type === "INPUT" && (
                <div>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Correct Short Answer</legend>
                    <input type="text" required className="input" placeholder="e.g., JavaScript Basics" value={q.correctAnswers[0] || ""}
                      onChange={(e) => handleQuestionChange(qIndex, { correctAnswers: [e.target.value] })} />
                  </fieldset>
                </div>
              )}

              {q.type === "CHECKBOX" && (
                <div className="space-y-2">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Options & Answers</legend>
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="input"
                          checked={q.correctAnswers.includes(opt) && opt !== ""}
                          onChange={(e) => {
                            const answers = e.target.checked
                              ? [...q.correctAnswers, opt]
                              : q.correctAnswers.filter((a) => a !== opt);
                            handleQuestionChange(qIndex, { correctAnswers: answers });
                          }}
                        />
                        <input
                          type="text"
                          required
                          placeholder={`Option ${oIndex + 1}`}
                          className="input"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </fieldset>

                  <button
                    type="button"
                    onClick={() => handleAddOption(qIndex)}
                    className="btn btn-soft w-full"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="btn btn-soft btn-error"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="btn"
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save & Publish Quiz
          </button>
        </div>
      </form>
    </div>
  );
}