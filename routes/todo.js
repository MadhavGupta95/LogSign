import fs from "fs/promises"
import { isAuthorized } from "../middleware/middleware.js";
import {v4 as uuidv4} from "uuid"
import express from "express"

const router = express.Router()

// endpoint for todo

router.post("/", isAuthorized, async(req, res)=>{
    try {
        const {user} = req
    const{title} = req.body

    if(!title){
        return res.status(400).json({
            message:"Enter title for todo",
            success:false
        })
    }

    const todo = {
        id:uuidv4(),
        title,
        completed:false,
        userID : user.id
    }

    const todos = await fs.readFile('./db/todo.json', 'utf-8')
    const parsedTodos = JSON.parse(todos)
    parsedTodos.push(todo)
    await fs.writeFile('./db/todo.json', JSON.stringify(parsedTodos))
    return res.json({
        data: todo,
        message:"Todo added successfully",
        success: true
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
})

router.get("/", isAuthorized, async(req, res)=>{
    try {
        const {user} = req
        const todos = await fs.readFile('./db/todo.json', 'utf-8')
        const parsedTodos = JSON.parse(todos)
        return res.json({
            data : parsedTodos.filter(todo=>todo.userID===user.id)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
})

export default router