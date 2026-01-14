import express from "express";
import { login, logout, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/", signup);
router.post("/", login);
router.post("/", logout);

export default router;
