import fs from "fs/promises";
import { isAuthorized } from "../middleware/middleware.js";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { Todo } from "../db/models/Todo.js";

const router = express.Router();

// endpoint for todo
// creating a todo
router.post("/", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Enter title for todo",
        success: false,
      });
    }

    // const todo = {
    //     id:uuidv4(),
    //     title,
    //     completed:false,
    //     userID : user.id
    // }

    const todo = await Todo.create({
      title,
      completed: false,
      userID: user.id,
    });

    // const todos = await fs.readFile('./db/todo.json', 'utf-8')
    // const parsedTodos = JSON.parse(todos)
    // parsedTodos.push(todo)
    // await fs.writeFile('./db/todo.json', JSON.stringify(parsedTodos))

    return res.json({
      data: todo,
      message: "Todo added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

// getting todo using jwt as authorization when user requests it
router.get("/", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    // const todos = await fs.readFile('./db/todo.json', 'utf-8')
    const todos = await Todo.find(
      /*now using find not findOne because findOne outputs the first match and we need all the matches */ {
        userID: user.id,
      }
    );
    // const parsedTodos = JSON.parse(todos)
    return res.json({
      data: todos,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// Editing/updating a todo
router.patch("/:id", isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    const { title, completed } = req.body;
    const { id: todoID } = req.params;

    // // check if todo exists
    // const todos = await fs.readFile('./db/todo.json', 'utf-8')
    // const parsedTodos = JSON.parse(todos)
    // const todo = parsedTodos.find(todo=>todo.id===todoID)
    // if(!todo){
    //     return res.status(404).json({
    //         message:"Todo not found",
    //         success:false
    //     })
    // }
    const todo = Todo.findOne({ _id: todoID });
    // check if todo belongs to user
    if (todo.userID !== user.id) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    // everything fine, update the todo
    if (todo.title !== undefined) {
      todo.title = title;
    }
    if (todo.completed !== completed) {
      todo.completed = completed;
    }
    // await fs.writeFile('./db/todo.json', JSON.stringify(parsedTodos))
    await Todo.findOneAndUpdate(
      { /*takes 3 params, this is query*/ _id: todoID },
      /*2nd - what do you want to update*/ todo,
      /*3rd - whether you want to return a new document or the old document */ {
        new: true,
      } /* this will now give me the new document */
    );
    return res.json({
      data: todo,
      success: true,
      message: "todos updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// deleting a todo
// router.delete("/:id", isAuthorized, async (req, res) => {
//   try {
//     const { user } = req;
//     const { id: todoID } = req.params;

//     // // check if todo exists
//     // const todos = await fs.readFile('./db/todo.json', 'utf-8')
//     // const parsedTodos = JSON.parse(todos)
//     // const todo = parsedTodos.find(todo=>todo.id===todoID)
//     // const todoIndex = parsedTodos.findIndex(todo=>todo.id===todoID)
//     // if(!todo){
//     //     return res.status(404).json({
//     //         message:"Todo not found",
//     //         success: false
//     //     })
//     // }
//     const todo = Todo.findOne({ _id: todoID });
//     // check if todo belongs to user
//     if (todo.userID !== user.id) {
//       return res.status(401).json({
//         message: "Unauthorized user",
//         success: false,
//       });
//     }

//     // everything correct, delete the todo
//     parsedTodos.splice(todoIndex, 1)[0];
//     // await fs.writeFile('./db/todo.json', JSON.stringify(parsedTodos))
//     await Todo.findOneAndDelete({ _id: todoID });
//     return res.json({
//       data: todo,
//       success: true,
//       message: "todo deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Internal server error",
//       success: false,
//     });
//   }
// });

export default router;
