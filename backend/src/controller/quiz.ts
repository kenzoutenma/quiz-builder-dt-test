import { Request, Response, Router } from "express";
import { z } from "zod";

import prisma from "../../prisma/index.js";

const quizRoute = Router();

const createQuizSchema = z.object({
  questions: z
    .array(
      z.object({
        correctAnswers: z.array(z.string()).min(1, "At least one correct answer must be provided."),
        options: z.array(z.string()).optional(),
        text: z.string().min(1, "Question text is required."),
        type: z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]),
      }),
    )
    .min(1, "Quiz must contain at least one question."),
  title: z.string().min(1, "Quiz title is required.").max(255),
});

const strictQuizSchema = createQuizSchema.superRefine((data, ctx) => {
  data.questions.forEach((question, index) => {
    if (question.type === "CHECKBOX") {
      if (!question.options || question.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: `Checkbox question at index ${index.toString()} must have at least 2 options.`,
          path: ["questions", index, "options"],
        });
      }
    }
  });
});

// post quiz
quizRoute.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = strictQuizSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        details: validation.error.flatten((val) => val).fieldErrors,
        error: "Validation failed",
      });
      return;
    }

    const { questions, title } = validation.data;

    const newQuiz = await prisma.quiz.create({
      data: {
        questions: {
          create: questions.map((q) => ({
            correctAnswers: q.correctAnswers,
            options: q.type === "CHECKBOX" ? q.options : undefined,
            text: q.text.trim(),
            type: q.type,
          })),
        },
        title: title.trim(),
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Failed to create quiz:", error);
    res.status(500).json({ error: "Internal server error occurred." });
  }
});

// get list of quizzes
quizRoute.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        _count: {
          select: { questions: true },
        },
        createdAt: true,
        id: true,
        title: true,
      },
    });

    res.status(200).json(
      quizzes.map((quiz) => ({
        createdAt: quiz.createdAt,
        id: quiz.id,
        questionCount: quiz._count.questions,
        title: quiz.title,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    res.status(500).json({ error: "Internal server error occurred." });
  }
});

// get quiz
quizRoute.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid quiz id." });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      include: {
        questions: true,
      },
      where: { id },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found." });
      return;
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    res.status(500).json({ error: "Internal server error occurred." });
  }
});

quizRoute.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid quiz id." });
      return;
    }

    const existing = await prisma.quiz.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: "Quiz not found." });
      return;
    }

    await prisma.quiz.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    res.status(500).json({ error: "Internal server error occurred." });
  }
});

export default quizRoute;
