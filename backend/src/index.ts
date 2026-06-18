import cors from "cors";
import express, { Application, Request, Response } from "express";

import quizRoute from "./controller/quiz.js";

const app: Application = express();
const PORT = process.env.PORT ?? "3001";

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"];

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/quizzes", quizRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
