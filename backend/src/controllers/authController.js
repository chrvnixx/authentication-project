import { sendVerificationEmail, sendWelcomeEmail } from "../config/emails.js";
import generateTokenAndSetCookie from "../config/generateTokenAndSetCookie.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";

export async function signup(req, res) {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    generateTokenAndSetCookie(res, user._id);

    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("Internal server error", error?.response || error?.message);
  }
}

export async function verifyEmail(req, res) {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: true,
        message: "Invalid or expired verification code",
      });
    }

    ((user.isVerified = true),
      (user.verificationToken = undefined),
      (user.verificationTokenExpiresAt = undefined));

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res
      .status(200)
      .json({ success: true, message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("Internal server error", error?.response || error?.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.json({ message: "all fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("error in login controller", error?.response || error?.message);
  }
}
export async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
}
