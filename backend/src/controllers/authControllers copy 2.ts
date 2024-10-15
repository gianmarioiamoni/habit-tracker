import { Request, Response, NextFunction } from "express";
import User from "../models/Users";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

// Function to generate a JWT token
const generateToken = (user: any): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc Register a new user
// @route POST /api/auth/signup
// @access Public
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Sanificazione input
  const sanitizedEmail = validator.normalizeEmail(email) || "";
  const sanitizedName = validator.escape(name);

  // Validazione input
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (!validator.isLength(password, { min: 6 })) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (user) {
      res.status(401).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login a user
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const sanitizedEmail = validator.normalizeEmail(email) || "";

  if (!validator.isEmail(sanitizedEmail)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const secret = process.env.JWT_SECRET || "MyLocalJWTSecret";
if (!secret) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Interface for the token payload
interface TokenPayload extends JwtPayload {
  id: string;
}

export const checkAuthStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies["authToken"]; 

    // Controlla se il token è presente.
    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return; 
    }

    // Decodifica il token e verifica l'utente.
    const decodedToken = jwt.verify(token, secret) as TokenPayload;
    const user = await User.findById(decodedToken.id).select("-password");

    // Se l'utente esiste, restituisci i dati dell'utente, altrimenti restituisci un errore.
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out successfully" });
};
