import mongoose from "mongoose";
import runSeeder from "./seeder/index.js";

const connectDB = async (url) => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .then(async () => await runSeeder())
    .catch((err) => console.log(err));
};
export default connectDB;
