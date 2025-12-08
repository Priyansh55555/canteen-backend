import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, email, password: hashed
    });

    res.json({ success: true, message: "User registered.", user });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2) Check password (assuming bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3) Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4) Send token in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,        // cannot be accessed by JS in browser
        secure: true || process.env.NODE_ENV === "production", // https only in prod
       //  sameSite: "strict",    // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
  console.log("user", req.user)
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};