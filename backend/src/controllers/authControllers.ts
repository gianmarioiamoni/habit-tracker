import { Request, Response } from "express";
import User from "../models/Users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Function to generate a JWT token
const generateToken = (user: any): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(401).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser);

      // Set the token in an HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true, // This makes it inaccessible via JavaScript (important for security)
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict', // Protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // Token expires in 7 days
      });

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);

      // Set the token in an HTTP-only cookie
      res.cookie('authToken', token, {
        httpOnly: true, // This makes it inaccessible via JavaScript (important for security)
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'strict', // Protect against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // Token expires in 7 days
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
