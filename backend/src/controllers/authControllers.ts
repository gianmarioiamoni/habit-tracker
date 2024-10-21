import { Request, Response } from "express";
import User from "../models/Users";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

import { encryptDataWithIV, decryptData } from "../utils/crypto";
import { sanitizeEmail } from "../utils/normalize";

import { validateCaptcha } from "../utils/captcha";

import redisClient from "../redis/redis";

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

  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedName = validator.escape(name);

  // Input validation
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (!validator.isLength(password, { min: 6 })) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  // Encrypt sensible data using the same function as in login
  const { encryptedEmail, iv } = encryptDataWithIV(sanitizedEmail);
  console.log("Signup - Encrypted email:", encryptedEmail);

  try {
    // Search for the user by using the encrypted email
    const user = await User.findOne({ email: encryptedEmail });
    console.log("Signup - User:", user);
    if (user) {
      res.status(401).json({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      name: sanitizedName,
      email: encryptedEmail, 
      iv, 
      password
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
  const { email, password, captchaToken } = req.body;

  const sanitizedEmail = sanitizeEmail(email);

  const redisKey = `login_attempts_${email}`;

  const attempts = await redisClient.get(redisKey);
  const attemptCount = attempts ? parseInt(attempts) : 0;

  console.log("Login - attemptCount:", attemptCount);
  //////////////////////
  // CAPTCHA
  // Verify if the 3 attempts limit has been reached
  // if (attemptCount >= 3 && captchaToken) {
  // if (attemptCount == 2) {
  //   res.status(439).json({ message: "CAPTCHA validation required" });
  //   return;
  // }
  // if (captchaToken) {
  //   console.log("CaptchaToken is NOT null");
  //   const isCaptchaValid = await validateCaptcha(captchaToken);
  //   console.log("Login - isCaptchaValid:", isCaptchaValid);
  //   if (!isCaptchaValid) {
  //     res.status(400).json({ message: "Invalid CAPTCHA" });
  //   }
  //   return;
  // }
////////////////////////////////////
  
  // Verify email format
  if (!validator.isEmail(sanitizedEmail)) {
    // Increase failed attempts in case of error
    await redisClient.incr(redisKey);
    await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour

    res.status(400).json({ message: "Invalid email format" });
    console.log("Invalid email format:", sanitizedEmail);
    return;
  }

  try {
    // Search for the user with the excrypted email
    const users = await User.find();

    let user = null;

    for (const u of users) {
      const { encryptedEmail } = encryptDataWithIV(sanitizedEmail, u.iv);
      if (encryptedEmail === u.email) {
        user = u;
        break;
      }
    }

    if (!user) {
      // Increase failed attempts in case of error
      await redisClient.incr(redisKey);
      await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour 

      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Password verification 
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increase failed attempts in case of error
      await redisClient.incr(redisKey);
      await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour
    
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate authentication token 
    const token = generateToken(user);

    console.log("Generated token:", token);

    // Cookie settings
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      domain: process.env.COOKIE_DOMAIN || "localhost",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // the user is valid, reset failed attempts
    await redisClient.del(redisKey);

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log("Server error:", error);
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

    if (!token) {
      res.status(201).json({ user: null });
      return;
    }

    const decodedToken = jwt.verify(token, secret) as unknown;

    if (
      typeof decodedToken === "object" &&
      decodedToken !== null &&
      "id" in decodedToken
    ) {
      const decoded = decodedToken as TokenPayload;

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
