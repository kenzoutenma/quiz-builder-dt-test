import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="max-w-xl w-full text-center space-y-8  p-10 rounded-2xl shadow-sm border">

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Quiz
          </h1>
          <p className=" text-lg">
            Create, manage, and inspect your custom dynamic quizzes instantly.
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* Navigation Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Link to Create Page */}
          <Link
            href="/create"
            className="group p-6 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition duration-200"
          >
            <div className="text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold  group-hover:text-blue-700 transition">
              Create a Quiz &rarr;
            </h2>
            <p className="text-sm  mt-1">
              Build dynamic Boolean, Input, or Checkbox questions.
            </p>
          </Link>

          {/* Link to List Page */}
          <Link
            href="/quizzes"
            className="group p-6 text-left border rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition duration-200"
          >
            <div className="text-blue-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-lg font-bold  group-hover:text-blue-700 transition">
              View All Quizzes &rarr;
            </h2>
            <p className="text-sm  mt-1">
              Browse your library, view layout configurations, or delete records.
            </p>
          </Link>

        </div>

        <div className="text-xs  font-mono">
          Connected to Prisma DB Instance
        </div>
      </div>
    </div>
  );
}