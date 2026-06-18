// app/quizzes/[id]/page.tsx
"use client";

import { QuestionPreviewCard } from "@/app/features/quiz/components/QuestionPreviewCard";
import { useQuizDetail } from "@/app/features/quiz/hooks/useQuizDetail";
import Link from "next/link";

export default function QuizDetailPage() {
  const { quiz, loading, error } = useQuizDetail();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading layout configuration...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
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
          <QuestionPreviewCard
            key={question.id}
            question={question}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}