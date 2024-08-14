import "./env.js";
import express from "express";
import connectToDB from "./src/config/mongoose.js";
import userRouter from "./src/features/users/users.router.js";
import ApplicationError from "./src/error/ApplicationError.js";
import cors from "cors";
import todoRouter from "./src/features/todos/todos.router.js";
import jwtAuth from "./src/middlewares/jwt.auth.js";

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to API" });
});

app.use("/users", userRouter);
app.use("/todos", jwtAuth, todoRouter);
app.use("/refresh", (req, res) => {});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Resource Which you are Looking for Not Found :)",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

export default app;
