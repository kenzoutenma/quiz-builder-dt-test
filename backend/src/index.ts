import express, { Application, Request, Response } from "express";

import quizRoute from "./controller/quiz.js";

const app: Application = express();
const PORT = process.env.PORT ?? "3001";

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/quizzes", quizRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
