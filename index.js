import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

const port = 3300;

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = uuidv4();
    const user = {
      email,
      password,
      token,
    };
    const users = await fs.readFile("./db/user.json", "utf-8");
    const parsedUsers = JSON.parse(users);
    if (parsedUsers.find((user) => user.email === email)) {
      return res.status(409).json({
        message: "this email already exists.",
      });
    }
    parsedUsers.push(user);
    fs.writeFile("./db/user.json", JSON.stringify(parsedUsers));
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error has occured.",
    });
  }
});

const isAuthorized = async(req, res, next)=>{
    try {
        const {token} = req.query
        if(!token){
            return res.status(409).json({
                "message" : "No token available"
        })
    }
    const users = await fs.readFile('./db/user.json', 'utf-8')
    const parsedUsers = JSON.parse(users)
    const user = parsedUsers.find(user=>user.token===token)
    if(!user){
        return res.status(401).json({
            "message" : "Invalid Token"
        })
    }
    req.user = user
    next()
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "message" : "Error Occured"
        })
    }
}


app.get("/todos", isAuthorized,async(req, res)=>{
    try {
        const {count =1 } = req.query
        console.log(req.user);
        const todos = await fs.readFile('./db/todo.json', 'utf-8')
        const parsedTodos = JSON.parse(todos)
        console.log(todos);
        res.status(200).json(parsedTodos.slice(0, count))
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            "message" : "Error Occured in Login."
        })
    }
})

app.listen(port, () => {
  console.log(`Hi madhav!\nyour server is running on port: ${port}`);
});
