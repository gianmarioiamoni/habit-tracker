import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/Users";

import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.authToken) {
    try {
      token = req.cookies.authToken;

      // Decode the JWT token (classic JWT flow)
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Retrieve the user from the database and add it to the request object
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  // Handle Google Token (OAuth flow)
  else if (req.cookies && req.cookies.googleToken) {
    try {
      token = req.cookies.googleToken;

      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res
          .status(401)
          .json({ message: "Google token verification failed" });
        return;
      }

      // Find or create the user in the database based on Google ID
      const user = await User.findOne({ googleId: payload.sub });
      if (!user) {
        res
          .status(401)
          .json({ message: "No user found with this Google ID" });
        return;
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, Google token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
