import mongoose from "mongoose";
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  allowedVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For private polls
  votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPublic: { type: Boolean, default: true }, // Public/Private poll
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
  tags: [{ type: String }],
});
export default mongoose.model("Poll", pollSchema);
