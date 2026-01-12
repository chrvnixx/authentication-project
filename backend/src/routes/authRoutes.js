import express from "express";
import { login, logout, signup } from "../controllers/authController.js";

const router = express.Router();

router.get("/", signup);
router.get("/", login);
router.get("/", logout);

export default router;
