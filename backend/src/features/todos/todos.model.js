import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  createdTime: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
});

const TodoModel = mongoose.model("todo", todoSchema);

export default TodoModel;
