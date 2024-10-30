import express from "express";
import { isAdmin, protect } from "../../middleware/auth.js";
import { alterAccess, getAllUsers, getUserInfo } from "./userController.js";

const router = express.Router();

router.get("/getAllUsers", protect, isAdmin, getAllUsers);
router.get("/getUser/:username", protect, isAdmin, getUserInfo);
router.patch("/alterAccess", protect, isAdmin, alterAccess);

export default router;
