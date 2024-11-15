import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../../models/User.js";
import Poll from "../../models/Poll.js";
import connectDB from "../connect.js";

// Load environment variables
dotenv.config({ path: "../.env" }); // Adjust path if necessary

const seedPolls = [
  {
    question: "What is your favorite programming language?",
    options: [
      { optionText: "JavaScript" },
      { optionText: "Python" },
      { optionText: "Java" },
      { optionText: "C#" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["programming", "languages"],
  },
  {
    question: "Do you prefer cats or dogs?",
    options: [{ optionText: "Cats" }, { optionText: "Dogs" }],
    isPublic: true,
    allowedVoters: [],
    tags: ["pets", "animals"],
  },
  {
    question: "What is your favorite season?",
    options: [
      { optionText: "Winter" },
      { optionText: "Spring" },
      { optionText: "Summer" },
      { optionText: "Fall" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["seasons"],
  },
  {
    question: "Which social media platform do you use the most?",
    options: [
      { optionText: "Facebook" },
      { optionText: "Twitter" },
      { optionText: "Instagram" },
      { optionText: "LinkedIn" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["social media"],
  },
  {
    question: "What type of movies do you enjoy the most?",
    options: [
      { optionText: "Action" },
      { optionText: "Comedy" },
      { optionText: "Drama" },
      { optionText: "Horror" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["movies", "entertainment"],
  },
  {
    question: "What is your favorite cuisine?",
    options: [
      { optionText: "Italian" },
      { optionText: "Chinese" },
      { optionText: "Indian" },
      { optionText: "Mexican" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["food"],
  },
  {
    question: "How often do you exercise?",
    options: [
      { optionText: "Daily" },
      { optionText: "Weekly" },
      { optionText: "Monthly" },
      { optionText: "Rarely" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["health"],
  },
  {
    question: "What is your dream vacation destination?",
    options: [
      { optionText: "Beach" },
      { optionText: "Mountains" },
      { optionText: "City" },
      { optionText: "Countryside" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["travel"],
  },
  {
    question: "Which device do you use the most?",
    options: [
      { optionText: "Smartphone" },
      { optionText: "Laptop" },
      { optionText: "Tablet" },
      { optionText: "Desktop" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["technology"],
  },
  {
    question: "Do you prefer coffee or tea?",
    options: [{ optionText: "Coffee" }, { optionText: "Tea" }],
    isPublic: true,
    allowedVoters: [],
    tags: ["beverages"],
  },
  {
    question: "What is your favorite type of music?",
    options: [
      { optionText: "Pop" },
      { optionText: "Rock" },
      { optionText: "Hip-hop" },
      { optionText: "Classical" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["music"],
  },
  {
    question: "What is your preferred mode of transport?",
    options: [
      { optionText: "Car" },
      { optionText: "Bike" },
      { optionText: "Bus" },
      { optionText: "Train" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["transportation"],
  },
  {
    question: "How many hours do you spend on the internet daily?",
    options: [
      { optionText: "Less than 1 hour" },
      { optionText: "1-3 hours" },
      { optionText: "3-5 hours" },
      { optionText: "More than 5 hours" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["internet", "lifestyle"],
  },
  {
    question: "Which brand do you trust the most?",
    options: [
      { optionText: "Apple" },
      { optionText: "Samsung" },
      { optionText: "Google" },
      { optionText: "Microsoft" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["brands", "technology"],
  },
  {
    question: "What is your preferred learning method?",
    options: [
      { optionText: "Visual" },
      { optionText: "Auditory" },
      { optionText: "Kinesthetic" },
      { optionText: "Reading/Writing" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["learning", "education"],
  },
  {
    question: "Do you prefer working from home or in an office?",
    options: [{ optionText: "Home" }, { optionText: "Office" }],
    isPublic: true,
    allowedVoters: [],
    tags: ["work"],
  },
  {
    question: "How do you usually get your news?",
    options: [
      { optionText: "Television" },
      { optionText: "Online" },
      { optionText: "Newspapers" },
      { optionText: "Radio" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["news", "media"],
  },
  {
    question: "What is your biggest source of stress?",
    options: [
      { optionText: "Work" },
      { optionText: "School" },
      { optionText: "Family" },
      { optionText: "Finance" },
    ],
    isPublic: true,
    allowedVoters: [],
    tags: ["stress", "life"],
  },
];

const seedDatabase = async () => {
  try {
    const users = await User.find({ role: "normal" });

    // Map users to their ObjectIds
    const userIds = users.map((user) => user._id);

    const seedPolls = [
      {
        question: "What is your favorite programming language?",
        creator: userIds[0],
        options: [
          { optionText: "JavaScript" },
          { optionText: "Python" },
          { optionText: "Java" },
          { optionText: "C#" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["programming", "languages"],
      },
      {
        question: "Do you prefer cats or dogs?",
        creator: userIds[1],
        options: [{ optionText: "Cats" }, { optionText: "Dogs" }],
        isPublic: true,
        allowedVoters: [],
        tags: ["pets", "animals"],
      },
      {
        question: "What is your favorite season?",
        creator: userIds[0],
        options: [
          { optionText: "Winter" },
          { optionText: "Spring" },
          { optionText: "Summer" },
          { optionText: "Fall" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["seasons"],
      },
      {
        question: "Which social media platform do you use the most?",
        creator: userIds[0],
        options: [
          { optionText: "Facebook" },
          { optionText: "Twitter" },
          { optionText: "Instagram" },
          { optionText: "LinkedIn" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["social media"],
      },
      {
        question: "What type of movies do you enjoy the most?",
        creator: userIds[2],
        options: [
          { optionText: "Action" },
          { optionText: "Comedy" },
          { optionText: "Drama" },
          { optionText: "Horror" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["movies", "entertainment"],
      },
      {
        question: "What is your favorite cuisine?",
        creator: userIds[0],
        options: [
          { optionText: "Italian" },
          { optionText: "Chinese" },
          { optionText: "Indian" },
          { optionText: "Mexican" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["food"],
      },
      {
        question: "How often do you exercise?",
        creator: userIds[1],
        options: [
          { optionText: "Daily" },
          { optionText: "Weekly" },
          { optionText: "Monthly" },
          { optionText: "Rarely" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["health"],
      },
      {
        question: "What is your dream vacation destination?",
        creator: userIds[1],
        options: [
          { optionText: "Beach" },
          { optionText: "Mountains" },
          { optionText: "City" },
          { optionText: "Countryside" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["travel"],
      },
      {
        question: "Which device do you use the most?",
        creator: userIds[3],
        options: [
          { optionText: "Smartphone" },
          { optionText: "Laptop" },
          { optionText: "Tablet" },
          { optionText: "Desktop" },
        ],
        isPublic: false,
        allowedVoters: [userIds[1], userIds[2]],
        tags: ["technology"],
      },
      {
        question: "Do you prefer coffee or tea?",
        creator: userIds[3],
        options: [{ optionText: "Coffee" }, { optionText: "Tea" }],
        isPublic: true,
        allowedVoters: [],
        tags: ["beverages"],
      },
      {
        question: "What is your favorite type of music?",
        creator: userIds[2],
        options: [
          { optionText: "Pop" },
          { optionText: "Rock" },
          { optionText: "Hip-hop" },
          { optionText: "Classical" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["music"],
      },
      {
        question: "What is your preferred mode of transport?",
        creator: userIds[0],
        options: [
          { optionText: "Car" },
          { optionText: "Bike" },
          { optionText: "Bus" },
          { optionText: "Train" },
        ],
        isPublic: false,
        allowedVoters: [userIds[1], userIds[3]],
        tags: ["transportation"],
      },
      {
        question: "How many hours do you spend on the internet daily?",
        creator: userIds[2],
        options: [
          { optionText: "Less than 1 hour" },
          { optionText: "1-3 hours" },
          { optionText: "3-5 hours" },
          { optionText: "More than 5 hours" },
        ],
        isPublic: false,
        allowedVoters: [userIds[1], userIds[2], userIds[0]],
        tags: ["internet", "lifestyle"],
      },
      {
        question: "Which brand do you trust the most?",
        creator: userIds[0],
        options: [
          { optionText: "Apple" },
          { optionText: "Samsung" },
          { optionText: "Google" },
          { optionText: "Microsoft" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["brands", "technology"],
      },
      {
        question: "What is your preferred learning method?",
        creator: userIds[0],
        options: [
          { optionText: "Visual" },
          { optionText: "Auditory" },
          { optionText: "Kinesthetic" },
          { optionText: "Reading/Writing" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["learning", "education"],
      },
      {
        question: "Do you prefer working from home or in an office?",
        creator: userIds[1],
        options: [{ optionText: "Home" }, { optionText: "Office" }],
        isPublic: false,
        allowedVoters: [userIds[3], userIds[0]],
        tags: ["work"],
      },
      {
        question: "How do you usually get your news?",
        creator: userIds[3],
        options: [
          { optionText: "Television" },
          { optionText: "Online" },
          { optionText: "Newspapers" },
          { optionText: "Radio" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["news", "media"],
      },
      {
        question: "What is your biggest source of stress?",
        creator: userIds[3],
        options: [
          { optionText: "Work" },
          { optionText: "School" },
          { optionText: "Family" },
          { optionText: "Finance" },
        ],
        isPublic: true,
        allowedVoters: [],
        tags: ["stress", "life"],
      },
    ];

    await Poll.deleteMany(); // Clear existing polls
    const polls = await Poll.insertMany(seedPolls); // Seed the polls

    // Update the user's pollsCreated array with the new poll IDs
    for (const poll of polls) {
      await User.findByIdAndUpdate(poll.creator, {
        $push: { pollsCreated: poll._id },
      });
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;
