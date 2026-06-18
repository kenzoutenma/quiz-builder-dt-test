import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export interface Question {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  options?: string[];
  correctAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export function useQuizDetail() {
  const params = useParams();
  const id = params?.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/quizzes/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Quiz setup not found.");
        if (!res.ok) throw new Error("Failed to fetch quiz structural profile.");
        return res.json();
      })
      .then((data) => {
        setQuiz(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return { quiz, loading, error };
}
