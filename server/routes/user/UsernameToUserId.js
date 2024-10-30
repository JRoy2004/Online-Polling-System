import User from "../../models/User.js";
import express from "express";
const router = express.Router();
// Route to fetch ObjectIds of users based on username
router.post("/getIds", async (req, res) => {
  try {
    const { username } = req.body;

    //console.log(username);

    // Find users by username
    const users = await User.findOne({ username });
    //console.log(users.id);
    if (users) {
      return res.status(200).json({ exists: true, userIds: users.id });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
