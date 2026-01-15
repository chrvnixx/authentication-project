import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", signup);
router.post("/", login);
router.post("/", logout);
router.post("/verify-email", verifyEmail);

export default router;
