import {
  sendPasswordResetSuccessEmail,
  sendResetPasswordTokenEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../config/emails.js";
import generateTokenAndSetCookie from "../config/generateTokenAndSetCookie.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    await sendResetPasswordTokenEmail(
      user.email,
      `${process.env.CLIENT_ADDRESS}/reset-password/${resetPasswordToken}`,
    );

    res.status(200).json({
      success: true,
      message: "Reset email sent!!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(
      "error in forgot password controller",
      error?.response || error?.message,
    );
  }
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendPasswordResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password updated!!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(
      "error in reset password controller",
      error?.response || error?.message,
    );
  }
}
