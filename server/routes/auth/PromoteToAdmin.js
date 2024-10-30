import User from "../../models/User.js";
// Promote user to admin (Admin-only access)
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if the requester is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the user and update the role to 'admin'
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
