import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust the import path based on your project structure

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");
      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  // Ensure the protect middleware has been called before
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Check if the user role is admin
    const user = await User.findById(req.user._id);
    if (user && user.role === "admin") {
      next(); // User is admin, proceed to the next middleware/route handler
    } else {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
