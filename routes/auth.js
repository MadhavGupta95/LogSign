import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import { addToDb } from "../utils/adtodb.js";
import { generateToken } from "../utils/jwt.js";


const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    // validate the user
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all the details",
        success: false,
      });
    }
    // check if user email exists
    const user = await fs.readFile("./db/user.json", "utf-8");
    const parsedUsers = JSON.parse(user);
    if (parsedUsers.find((user) => user.email === email)) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // validate the username
    if (parsedUsers.find((user) => user.username === username)) {
      return res.status(400).json({
        message: "Username already exists",
        success: false,
      });
    }

    //if all good, add to db
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPass,
    };
    await addToDb(newUser, "./db/user.json");
    return res.json({
      data: {
        ...newUser,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // validate credentials
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter all details",
        success: false,
      });
    }

    //Authenticate the user
    const users = await fs.readFile("./db/user.json", "utf-8");
    const parsedUsers = JSON.parse(users);
    const user = await parsedUsers.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
        success: false,
      });
    }
    const hasValidPass = await bcrypt.compare(password, user.password);
    if (!hasValidPass) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    const token = generateToken({
      username: user.username,
      email:user.email,
      id:user.id
    })
    return res.json({
      data: {
        token,
      },
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

// router.get("/api/todos", isAuthorized,async(req, res)=>{
//   try {
//     console.log(req.user);
//     return res.send("Everything works fine!")
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message:"Internal Server Error",
//       success: false
//     })
//   }
// })

export default router