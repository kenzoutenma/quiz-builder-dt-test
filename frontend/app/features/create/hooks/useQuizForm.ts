import { useState } from "react";
import { useRouter } from "next/navigation";

export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface QuestionInput {
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: string[];
}

export function useQuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionInput[]>([{ text: "", type: "BOOLEAN", options: [], correctAnswers: [] }]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "BOOLEAN", options: [], correctAnswers: [] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, fields: Partial<QuestionInput>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...fields } : q)));
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q)));
  };

  const updateOption = (qIndex: number, oIndex: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;

        const newOptions = [...q.options];
        const oldVal = newOptions[oIndex];
        newOptions[oIndex] = val;

        // Fixes the text-change bug: update string in correctAnswers if it matches old value
        const newAnswers = q.correctAnswers.map((ans) => (ans === oldVal ? val : ans));

        return { ...q, options: newOptions, correctAnswers: newAnswers };
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedQuestions = questions.map((q) => ({
      text: q.text,
      type: q.type,
      options: q.type === "CHECKBOX" ? q.options : [],
      correctAnswers: q.correctAnswers,
    }));

    try {
      const res = await fetch(`/api/quizzes`, {
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

  return {
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
  };
}
