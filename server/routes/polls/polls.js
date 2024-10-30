import express from "express";
import {
  createPoll,
  getPolls,
  getPollById,
  getUserPolls,
  updatePoll,
  deletePoll,
  votePoll,
  getPollResults,
} from "./pollsController.js"; // Import your controller functions
import { protect } from "../../middleware/auth.js"; // Import protect middleware

const router = express.Router();

// Create a new poll
router.post("/", protect, createPoll);

// Get all polls (public or private based on user's permission)
router.get("/", protect, getPolls);

//Get all polls created by user himself
router.get("/user/:userId?", protect, getUserPolls);

// Get a poll by ID
router.get("/:id", protect, getPollById);

// Update a poll (only by the creator)
router.patch("/:id", protect, updatePoll);

// Delete a poll (only by the creator and admin)
router.delete("/:id", protect, deletePoll);

// Vote on a poll
router.post("/:id/vote", protect, votePoll);

// Get poll results
router.get("/:id/results", protect, getPollResults);

export default router;
