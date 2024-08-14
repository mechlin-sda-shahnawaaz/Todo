import express from "express";
import TodoController from "./todos.controller.js";

const todoRouter = express.Router();

const todoController = new TodoController();

todoRouter.get("/", (req, res, next) => {
  todoController.getAllTodo(req, res, next);
});
todoRouter.post("/", (req, res, next) => {
  todoController.addTodo(req, res, next);
});
todoRouter.put("/:todoId", (req, res, next) => {
  todoController.updateTodo(req, res, next);
});
todoRouter.delete("/:todoId", (req, res, next) => {
  todoController.deleteTodo(req, res, next);
});

export default todoRouter;
