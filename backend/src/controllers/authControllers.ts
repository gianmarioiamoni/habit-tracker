import { Request, Response } from "express";
import User from "../models/Users";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";


import { encryptDataWithIV, decryptData } from "../utils/crypto";
import { sanitizeEmail } from "../utils/normalize";

import { validateCaptcha } from "../utils/captcha";

import redisClient from "../redis/redis";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// Function to generate a JWT token
const generateToken = (user: any): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const client = new OAuth2Client(googleClientId);
// Google login
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

  try {
    // Search for the user by using the encrypted email
    const user = await User.findOne({ email: encryptedEmail });
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

  // CAPTCHA
  if (!captchaToken && attemptCount == 2) {
    await redisClient.incr(redisKey);
    await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour
    res.status(439).json({ message: "CAPTCHA validation required" });
    return;
  }
  if (captchaToken) {
    const isCaptchaValid = await validateCaptcha(captchaToken);
    if (!isCaptchaValid) {
      await redisClient.incr(redisKey);
      await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour
      res.status(400).json({ message: "Invalid CAPTCHA" });
      return;
    }
  }
  
  // Verify email format
  if (!validator.isEmail(sanitizedEmail)) {
    // Increase failed attempts in case of error
    await redisClient.incr(redisKey);
    await redisClient.expire(redisKey, 60 * 60); // expire after 1 hour

    res.status(400).json({ message: "Invalid email format" });
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
  // Check if the user is authenticate with login/password 
  if (req.cookies && req.cookies.authToken) {
    const token = req.cookies.authToken;
    try {
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
  } else if (req.cookies && req.cookies.googleToken) { // check if the user is authenticated with Google
    const token = req.cookies.googleToken;
    try {
      if (!token) {
        res.status(201).json({ user: null });
        return;
      }

      // Google token verification
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();

      if (payload && payload.sub) {
        // Check if user already exists by using Google ID
        const user = await User.findOne({ googleId: payload.sub }).select(
          "-password"
        );

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
  }
}


export const googleLogin = async (req: Request, res: Response) => {
  const { tokenId } = req.body;

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload();
    if (payload && 'email' in payload && 'name' in payload && 'picture' in payload && 'sub' in payload) {
      const { email, name, picture, sub } = payload;

      // Check if the user already exists
      let user = await User.findOne({ email });

      if (!user) {
        // If the user doesn't exist, create a new one, including googleId
        user = new User({ email, name, avatar: picture, googleId: sub });
        await user.save();
      }

      // Cookie settings
      res.cookie("googleToken", tokenId, {
        httpOnly: true,
        secure: false, // for local development only 
        sameSite: "lax",
        domain: "localhost", // locahost for test
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: "Google login successful",
        token: tokenId,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      throw new Error('Invalid Google token payload');
    }
  
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Google login failed" });
  }
}; 


// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear the authToken cookie for JWT login
  res.clearCookie("authToken");

  // Clear the googleToken cookie if it exists (for Google login)
  res.clearCookie("googleToken");

  res.status(200).json({ message: "Logged out successfully" });
};

export const updateNotificationToken = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { token } = req.body;

  console.log("userId: ", userId);
  console.log("token: ", token)

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.notificationToken = token;
    await user.save();

    res.status(200).json({ message: "Notification token updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update notification token", error });
  }
};


