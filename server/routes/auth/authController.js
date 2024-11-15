import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js"; // Import your User model
import { sendVerificationEmail } from "./authService.js"; // Import the email service

// User Registration
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false, // Set initial verification status
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendVerificationEmail(savedUser);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Email Verification
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true; // Set the user's email as verified
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// User Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "Invalid credentials or email not verified" });
    }
    if (!user.accessStatus) {
      return res.status(400).json({ message: "User Restricted" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//username is unique
export const isUnique = async (req, res) => {
  const { field, value } = req.body;
  try {
    const user = await User.findOne({ [field]: value });

    if (user) {
      return res
        .status(200)
        .json({ unique: false, message: `${field} already exists` });
    } else {
      return res.status(200).json({ unique: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//Validation token
export const validateToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    res.status(200).json({ isValid: true, userRole: user.role });
  } catch (error) {
    res.status(401).json({ isValid: false, message: "Invalid token" });
  }
};

// Request to Change User Information
export const requestChange = async (req, res) => {
  const { oldUsername, newUsername, newEmail, newPassword, oldPassword } =
    req.body;

  try {
    const user = await User.findOne({ username: oldUsername });
    const id = user._id;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new username or email already exists
    if (newUsername && (await User.findOne({ username: newUsername }))) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // if (newEmail && (await User.findOne({ email: newEmail }))) {
    //   return res.status(400).json({ message: "Email already exists" });
    // }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token with the new data
    const token = jwt.sign(
      { id, newUsername, newEmail, newPassword },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send email verification for the changes
    await sendVerificationEmail(user, token, newEmail);

    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyChange = async (req, res) => {
  const { token } = req.params;

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // Fetch the user using the decoded id
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If it's a signup email verification (no changes in data)
    if (!decoded.newEmail && !decoded.newUsername && !decoded.newPassword) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      }

      // Mark user as verified
      user.isVerified = true;
      await user.save();
      return res.status(200).send({ message: "Email verified successfully." });
    }

    // If it's an email, username, or password change
    if (decoded.newEmail) {
      user.email = decoded.newEmail;
    }
    if (decoded.newUsername) {
      user.username = decoded.newUsername;
    }
    if (decoded.newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(decoded.newPassword, salt);
      user.password = hashedPassword; // Assume the password is already hashed
    }

    // Save the changes
    await user.save();

    res.status(200).json({ message: "User data updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
