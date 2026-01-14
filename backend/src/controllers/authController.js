import sendVerificationEmail from "../config/emails.js";
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

    await sendVerificationEmail(email, verificationToken);

    await user.save();

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
export async function login(req, res) {
  res.send("login");
}
export async function logout(req, res) {
  res.send("logout");
}
