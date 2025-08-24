import User from "../models/user.js";
import { hashPassword } from "../services/hashPassword.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "temp_secret_key";
const JWT_EXPIRES_IN = "7d";

export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        let emailLowerTrim = emailLowerTrim.toLowerCase();
        emailLowerTrim = emailLowerTrim.trim();
        
        username = username.trim();
        if (!username || !password || !emailLowerTrim) {
            return res.status(400).json({ error: "Username, password, and email are required" });
        }

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingEmail = await User.findOne({ where: { email: emailLowerTrim } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            email: emailLowerTrim,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
  try {
    console.log(req.body)
    const { usernameOrEmail, password } = req.body;
    const usernameOrEmailTrimed = usernameOrEmail.trim();

    if (!usernameOrEmailTrimed || !password) {
      return res
        .status(400)
        .json({ error: "Username/email and password are required" });
    }

    // Simple regex to test if it's an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmailTrimed);

    const user = await User.findOne({
      where: isEmail
        ? { email: usernameOrEmailTrimed.toLowerCase() }
        : { username: usernameOrEmailTrimed },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getSession = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "username", "email"]
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
