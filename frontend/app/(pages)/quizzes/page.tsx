"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface QuizListItem {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/quizzes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quizzes");
        return res.json();
      })
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Could not delete quiz.");

      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading quizzes...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 gap-2.5">
        <h1 className="text-3xl font-bold">Available Quizzes</h1>
        <Link href="/create" className="btn btn-soft btn-primary">
          Create Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-center py-8">No quizzes found. Go make one!</p>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex justify-between items-center p-4 border rounded hover:bg-indigo-950 hover:text-indigo-100 transition"
            >
              <Link href={`/quizzes/${quiz.id}`} className="flex-1 block">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 hover:underline">{quiz.title}</h2>
                  <p className="text-sm">{quiz.questionCount} Questions</p>
                </div>
              </Link>

              <button
                onClick={(e) => handleDelete(quiz.id, e)}
                className=" hover:text-red-600 p-2 transition"
                title="Delete Quiz"
                aria-label="Delete"
              >
                {/* Clean SVG Trash Bin Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}