import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import Poll from "../../models/Poll.js";
import connectDB from "../connect.js";

// Load environment variables
dotenv.config({ path: "../.env" }); // Adjust path if necessary

const seedUsers = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    isVerified: true,
  },
  {
    username: "user1",
    email: "user1@example.com",
    password: "password1",
    isVerified: true,
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "password2",
    isVerified: true,
  },
  {
    username: "user3",
    email: "user3@example.com",
    password: "password3",
    isVerified: true,
  },
  {
    username: "user4",
    email: "user4@example.com",
    password: "password4",
    isVerified: true,
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Poll.deleteMany({});

    // Hash passwords and seed users
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    const users = await User.insertMany(hashedUsers);
    //console.log("Users seeded:", users);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;
