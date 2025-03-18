import mongoose from "mongoose";

const DB_URI = `ur_mongoose_link`;

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
