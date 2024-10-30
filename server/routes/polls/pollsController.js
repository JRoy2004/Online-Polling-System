import mongoose from "mongoose";
import Poll from "../../models/Poll.js"; // Adjust the import path based on your project structure
import User from "../../models/User.js";

// Create a new poll
export const createPoll = async (req, res) => {
  try {
    const { question, options, isPublic, allowedVoters, expiresAt, tags } =
      req.body;

    // Validate that the poll has a question and at least two options
    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: "Poll must have a question and at least two options.",
      });
    }
    let allAllowedVoters;
    if (!isPublic && allowedVoters) {
      const userIds = await User.find(
        { username: { $in: allowedVoters } },
        "_id"
      );
      allAllowedVoters = userIds.map((user) => user._id); // Update with ObjectIds
    } else {
      allAllowedVoters = []; // Clear allowedVoters for public polls
    }

    const newPoll = new Poll({
      question,
      options,
      creator: req.user._id, // Assuming you are using authentication middleware
      isPublic,
      allowedVoters: allAllowedVoters,
      votedUsers: [],
      expiresAt: expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000, // Set default expiry to 1 week
      tags: tags || [],
    });

    await newPoll.save();
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pollsCreated.push(newPoll._id);
    await user.save();

    res.status(201).json(newPoll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all polls
export const getPolls = async (req, res) => {
  try {
    const { tags } = req.query; // Extract tags from the query params
    let polls;
    // Admin can retrieve all polls, with optional filtering by tags
    if (req.user.role === "admin") {
      if (tags) {
        polls = await Poll.find({ tags: { $in: tags.split(",") } }).populate(
          "creator",
          "username"
        );
      } else {
        polls = await Poll.find({}).populate("creator", "username");
      }
      return res.status(200).json(polls);
    }
    // For regular users, filter by public polls or those they're allowed to vote in
    if (tags) {
      polls = await Poll.find({
        $or: [{ isPublic: true }, { allowedVoters: req.user._id }],
        tags: { $in: tags.split(",") }, // Filter polls by tags
      }).populate("creator", "username");
    } else {
      polls = await Poll.find({
        $or: [{ isPublic: true }, { allowedVoters: req.user._id }],
      }).populate("creator", "username");
    }
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all polls created by a specific user
export const getUserPolls = async (req, res) => {
  try {
    // If `userId` is provided as a parameter, check if the requester is an admin
    const { userId } = req.params;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    // Determine which user data to fetch based on requester role and presence of `userId`
    const targetUserId =
      userId && requesterRole === "admin" ? userId : requesterId;

    // Validate the user ID format
    // if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    //   return res.status(400).json({ message: "Invalid user ID format" });
    // }

    // Find the user and populate the pollsCreated array
    const user = await User.findById(targetUserId).populate("pollsCreated");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any created polls
    if (!user.pollsCreated || user.pollsCreated.length === 0) {
      return res.status(404).json({ message: "No polls found for this user" });
    }

    // Send the polls created by the target user
    res.status(200).json(user.pollsCreated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a poll by ID
export const getPollById = async (req, res) => {
  // Check if the ID is valid (24 characters for ObjectId)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid poll ID format" });
  }
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "creator",
      "username"
    );

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    // Check if the poll is private and if the user is allowed to access it
    if (req.user.role === "admin") {
      return res.status(200).json(poll);
    }
    if (
      !poll.isPublic &&
      !poll.allowedVoters.includes(req.user._id.toString()) &&
      poll.creator._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const usernames = await Promise.all(
      poll.allowedVoters.map(async (user) => {
        const foundUser = await User.findById(user).select("username");
        return foundUser ? foundUser.username : null; // Handle case where user might not be found
      })
    );
    //console.log({ ...poll._doc, allowedVoters: usernames });

    res.status(200).json({ ...poll._doc, allowedVoters: usernames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a poll
export const updatePoll = async (req, res) => {
  // Check if the ID is valid (24 characters for ObjectId)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid poll ID format" });
  }
  try {
    const { question, options, isPublic, allowedVoters, expiresAt, tags } =
      req.body;
    // Check for duplicate options
    const optionTexts = options.map((opt) => opt.optionText);
    const uniqueOptions = new Set(optionTexts);

    if (uniqueOptions.size !== optionTexts.length) {
      return res.status(400).json({ message: "Poll options must be unique" });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Ensure the user is the creator of the poll
    if (poll.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this poll" });
    }

    // Update poll fields
    poll.question = question || poll.question;
    poll.options = options || poll.options;
    poll.isPublic = isPublic;

    if (!isPublic && allowedVoters) {
      const userIds = await User.find(
        { username: { $in: allowedVoters } },
        "_id"
      );
      poll.allowedVoters = userIds.map((user) => user._id); // Update with ObjectIds
    } else {
      poll.allowedVoters = []; // Clear allowedVoters for public polls
    }

    poll.expiresAt = expiresAt || poll.expiresAt;
    poll.tags = tags || poll.expiresAt;

    const updatedPoll = await poll.save();
    res.status(200).json(updatedPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a poll
export const deletePoll = async (req, res) => {
  try {
    // Check if the ID is valid (24 characters for ObjectId)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid poll ID format" });
    }
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    // Check if the user is the admin
    if (req.user.role === "admin") {
      // Admin can delete any poll
      await Poll.findByIdAndDelete(req.params.id);
      const user = await User.findById(poll.creator);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.pollsCreated = user.pollsCreated.filter(
        (pollId) => pollId.toString() !== req.params.id
      );
      await User.findByIdAndUpdate(user._id, { $inc: { removedPollCount: 1 } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Poll removed successfully by admin" });
    }

    // Ensure the user is the creator of the poll
    if (poll.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this poll" });
    }

    // Proceed to delete if the user is the creator
    await Poll.findByIdAndDelete(req.params.id);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pollsCreated = user.pollsCreated.filter(
      (pollId) => pollId.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Vote on a poll
export const votePoll = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid poll ID format" });
    }
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    // Check if the poll has expired
    if (poll.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "This poll has expired and cannot accept votes" });
    }
    // Check if the poll is private and if the user is allowed to vote
    if (!poll.isPublic && !poll.allowedVoters.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to vote on this poll" });
    }
    // Check if the user has already voted
    if (poll.votedUsers.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this poll" });
    }
    // Retrieve option index from request

    const optionIndex = poll.options.findIndex(
      (opt) => opt.optionText === req.body.optionText
    );

    // Ensure optionIndex is valid
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    // Update the selected option's vote count
    poll.options[optionIndex].votes += 1;

    // Add the user to the votedUsers array
    poll.votedUsers.push(req.user._id);

    await poll.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get poll results
export const getPollResults = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid poll ID format" });
    }
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Calculate total votes
    const totalVotes = poll.options.reduce(
      (acc, option) => acc + option.votes,
      0
    );

    // Check if the poll is expired
    const isExpired = poll.expiresAt < Date.now();

    // Structure the result data
    const result = {
      question: poll.question,
      creator: poll.creator.username,
      isPublic: poll.isPublic,
      options: poll.options.map((option) => ({
        optionText: option.optionText,
        votes: option.votes,
      })),
      isExpired,
      totalVotes,
      createdAt: poll.createdAt,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
