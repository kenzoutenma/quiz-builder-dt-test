"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  options?: string[];
  correctAnswers: string[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}quizzes/${id}`)
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

  if (loading) return <div className="p-8 text-center">Loading layout configuration...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
          &larr; Back to List
        </Link>
        <h1 className="text-3xl font-bold mt-2">{quiz.title}</h1>
        <p className="text-sm  mt-1">Structural Configuration View (Read Only)</p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="p-5 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">Question {index + 1}</span>
              <span className="text-xs uppercase px-2 py-0.5 rounded font-mono">
                {question.type}
              </span>
            </div>

            <p className="text-lg mb-4">{question.text}</p>

            <div className="pointer-events-none opacity-70 space-y-2">
              {question.type === "BOOLEAN" && (
                <div className="flex space-x-4 text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked={question.correctAnswers.includes("true")} readOnly />
                    <span>True</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" checked={question.correctAnswers.includes("false")} readOnly />
                    <span>False</span>
                  </label>
                </div>
              )}

              {question.type === "INPUT" && (
                <div>
                  <label className="block text-xs font-medium mb-1">Expected Answer Value:</label>
                  <input
                    type="text"
                    className="border  p-2 rounded w-full"
                    value={question.correctAnswers[0] || ""}
                    readOnly
                  />
                </div>
              )}

              {question.type === "CHECKBOX" && question.options && (
                <div className="space-y-1">
                  {question.options.map((option, oIdx) => (
                    <label key={oIdx} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" checked={question.correctAnswers.includes(option)} readOnly />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}