import express from "express";

// import { v4 as uuidv4 } from "uuid";
// import fs from "fs/promises";
// import bcrypt from "bcrypt";
// import { addToDb } from "./utils/adtodb.js";
// import { generateToken } from "./utils/jwt.js";
// import { isAuthorized } from "./middleware/middleware.js";

import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js";
import pagesRoutes from "./routes/pages.js";
import { connectDb } from "./utils/db.utils.js";

const port = 3300;

const app = express();
connectDb();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/", pagesRoutes);

app.listen(port, () => {
  console.log(`Hi madhav!\nyour server is running on port: ${port}`);
});
