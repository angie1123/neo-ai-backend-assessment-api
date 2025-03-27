import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../modules/User.js";

const router = express.Router();


const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  console.log(process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.status(403).json({ error });
    req.user = user;
    next();
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 8);
   

    await User.create({ name, email, password: hashedPassword });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("userPassord length", user.password.length);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });

      return res
        .status(200)
        .json({ token, message: "User logged in successfully" });
    }
    console.log("isMatch", isMatch);

    return res.status(401).json({ error: "Password does not match" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    console.log(req.body);
    const { name, phoneNumber, email } = req.body;
    await User.update(
      { name, phoneNumber, email },
      { where: { email: req.user.email } }
    );
    res.json({ message: "Profile update successfullt" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export { router as authRoutes, authenticateToken };
