import mongoose from "mongoose";

const DB_URI = `mongodb+srv://madhav:sgZHL2B4A4mLzz4f@mycluster.4xj0n.mongodb.net/`;

export const connectDb = async () => {
  try {
    mongoose.connect(
      DB_URI,
      {} /* this curly bracket is anti parameter as we dont want to add any extra parameters*/
    );
    console.log("connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
};
