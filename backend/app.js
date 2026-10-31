import express from "express";

import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import templateRouter from "./routes/template.routes.js";
import connectToDatabase from "./database/mongodb.js";

const apiUrl = "/peliplan/v1";

const app = express();

app.use(`${apiUrl}/auth`, authRouter);
app.use(`${apiUrl}/users`, userRouter);
app.use(`${apiUrl}/templates`, templateRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Peliplan API!");
});

app.listen(PORT, async () => {
  console.log(`Peliplan API is running on http://localhost:${PORT}`);
  await connectToDatabase();
});
