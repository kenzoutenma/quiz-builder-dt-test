import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001/";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const res = await fetch(`${BACKEND_URL}quizzes/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "Quiz setup not found." }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch quiz structural profile." }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const res = await fetch(`${BACKEND_URL}quizzes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Could not delete quiz." }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
