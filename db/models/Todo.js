// schema[blueprint] for todos

import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 1,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref /*reference*/: "User",
  },
});

export const Todo = mongoose.model('Todo', TodoSchema)
