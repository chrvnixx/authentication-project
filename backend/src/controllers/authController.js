import User from "../model/User.js";
import bcrypt from "bcrypt";

export async function signup(req, res) {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
  } catch (error) {}
}
export async function login(req, res) {
  res.send("login");
}
export async function logout(req, res) {
  res.send("logout");
}
