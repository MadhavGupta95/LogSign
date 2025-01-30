import express from 'express'
import path from "node:path"
const router = express.Router()

router.get('/signup', (req, res)=>{
    const filePath = path.join(path.resolve(), "pages", "signup.html")
    return res.sendFile(filePath)
})
router.get('/login', (req, res)=>{
    const filePath = path.join(path.resolve(), "pages", "login.html")
    return res.sendFile(filePath)
})
router.get('/', (req, res)=>{
    const filePath = path.join(path.resolve(), "pages", "todos.html")
    return res.sendFile(filePath)
})

export default router