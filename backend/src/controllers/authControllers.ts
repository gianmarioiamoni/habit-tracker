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

  const sanitizedEmail =
    validator.normalizeEmail(email, {
      gmail_remove_dots: false, // Mantiene i punti nei nomi utente Gmail
      gmail_remove_subaddress: false, // Mantiene i subaddress negli indirizzi Gmail
      gmail_convert_googlemaildotcom: true, // Converte @googlemail.com in @gmail.com
      all_lowercase: true, // Converte in minuscolo (mantenuto per evitare discrepanze)
    }) || "";


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
      domain: process.env.COOKIE_DOMAIN || "localhost",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
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
    const token = req.cookies.authToken;
    console.log("req.cookies:", req.cookies)
    console.log("Token1:", token);

    if (!token) {
      res.status(201).json({ user: null });
      return;
    }

    console.log("Token2:", token);

    const decodedToken = jwt.verify(token, secret) as unknown;

    if (
      typeof decodedToken === "object" &&
      decodedToken !== null &&
      "id" in decodedToken
    ) {
      const decoded = decodedToken as TokenPayload;

      console.log("Decoded token:", decoded);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(201).json({ user: null });
        return;
      }

      res.json({ user });
      return;

    } else {
      res.status(201).json({ user: null });
      return;
    }
  } catch (error) {
    console.error("Error when verifying token:", error);
    res.status(201).json({ user: null });
    return;
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out successfully" });
};
