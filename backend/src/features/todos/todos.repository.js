import mongoose from "mongoose";
import TodoModel from "./todos.model.js";
import ApplicationError from "../../error/ApplicationError.js";

export default class TodoRepository {
  async add(data) {
    try {
      const newTodo = new TodoModel(data);
      await newTodo.save();
      return newTodo;
    } catch (error) {
      throw error;
    }
  }

  async update(filter, updatedData) {
    try {
      const updatedTodo = await TodoModel.findOneAndUpdate(
        filter,
        updatedData,
        { returnDocument: "after" }
      );
      return updatedTodo;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ApplicationError("Incorrect TodoId", 406);
      }
      throw error;
    }
  }

  async getAll(filter, skip, limit, search) {
    try {
      const data = (
        await TodoModel.find(filter).skip(skip).limit(limit)
      ).filter(
        (value) =>
          value.title.includes(search) || value.description.includes(search)
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete(filter) {
    try {
      const deletedData = await TodoModel.deleteOne(filter);
      return deletedData;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new ApplicationError("Incorrect TodoId", 406);
      }
      throw error;
    }
  }
}
