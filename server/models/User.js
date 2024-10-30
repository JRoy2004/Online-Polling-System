import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["normal", "admin"], default: "normal" },
  pollsCreated: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Poll", default: [] },
  ],
  accessStatus: { type: Boolean, default: true },
  removedPollCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
