import express from "express";
import {
  register,
  verifyEmail,
  login,
  isUnique,
  validateToken,
  verifyChange,
  requestChange,
} from "./authController.js";
import { promoteToAdmin } from "./PromoteToAdmin.js";
import { protect, isAdmin } from "../../middleware/auth.js";
const router = express.Router();

router.get("/validate", validateToken);

// User Registration
router.post("/register", register);

// Email Verification
router.get("/verify/:token", verifyChange); //verifyEmail

//Request Change
router.post("/update-user", requestChange);

// User Login
router.post("/login", login);

router.put("/promote", protect, isAdmin, promoteToAdmin);

router.post("/user/check-unique", isUnique);

export default router;
