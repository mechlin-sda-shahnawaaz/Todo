import ApplicationError from "../../error/ApplicationError.js";
import TodoRepository from "./todos.repository.js";

export default class TodoController {
  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async addTodo(req, res, next) {
    try {
      const { title, description, dueDate } = req.body;
      if (!title || !description || !dueDate) {
        throw new ApplicationError("All fields Must be Present", 406);
      }
      const { userId } = req;
      const todo = await this.todoRepository.add({
        title,
        description,
        createdBy: userId,
        dueDate,
        createdTime: new Date(),
        isCompleted: false,
      });
      return res.status(201).json({ success: true, todo });
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req, res, next) {
    try {
      const { userId } = req;
      const { todoId } = req.params;

      if (!todoId) {
        throw new ApplicationError("Todo Id not Present", 406);
      }
      const { title, dueDate, description, isCompleted } = req.body;
      if (!title && !dueDate && !description && isCompleted == undefined) {
        throw new ApplicationError(
          "AtLeast One Field is Required to Update",
          406
        );
      }
      const updatedData = {};
      if (title) {
        updatedData.title = title;
      }

      if (dueDate) {
        updatedData.dueDate = dueDate;
      }

      if (description) {
        updatedData.description = description;
      }

      if (isCompleted !== undefined) {
        updatedData.isCompleted = isCompleted;
      }

      const afterUpdate = await this.todoRepository.update(
        {
          _id: todoId,
          createdBy: userId,
        },
        updatedData
      );

      if (!afterUpdate) {
        throw new ApplicationError("Todo not found", 404);
      }
      return res.status(200).json({ success: true, todo: afterUpdate });
    } catch (error) {
      next(error);
    }
  }

  async getAllTodo(req, res, next) {
    try {
      const { userId } = req;
      const pageNum = req.query.pageNum || 1;
      const limit = req.query.limit || 5;
      const search = req.query.search || "";
      const todos = await this.todoRepository.getAll(
        { createdBy: userId },
        (pageNum - 1) * limit,
        limit,
        search
      );
      return res.status(200).json({ success: true, todos });
    } catch (error) {
      next(error);
    }
  }

  async deleteTodo(req, res, next) {
    try {
      const { userId } = req;
      const { todoId } = req.params;
      if (!todoId) {
        throw new ApplicationError("Todo Id not Present", 406);
      }
      const deletedItem = await this.todoRepository.delete({
        createdBy: userId,
        _id: todoId,
      });
      if (!deletedItem.deletedCount) {
        throw new ApplicationError("Todo not found", 404);
      }
      return res
        .status(200)
        .json({ success: true, message: "Todo Deleted Successfully !!" });
    } catch (error) {
      next(error);
    }
  }
}
