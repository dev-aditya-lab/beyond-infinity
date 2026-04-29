import mongoose from "mongoose";
import { config } from "../config.js";

const connectToDB = () => {
  try {
    mongoose.connect(config.MONGO_URI);
    console.log("Connected To Database");
  } catch (error) {
    console.log("Error while connecting to Database", error);
  }
};

export default connectToDB;
