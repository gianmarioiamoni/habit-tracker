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
  // Verifica Google Token
  else if (req.cookies && req.cookies.googleToken) {
    try {
      token = req.cookies.googleToken;

      const decodedWithoutVerification = jwt.decode(token);

      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      if (!ticket) {
        throw new Error(
          "Google token verification failed: ticket is null or undefined."
        );
      }

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error(
          "Google token verification failed: payload is null or undefined."
        );
      }

      const user = await User.findOne({ googleId: payload.sub });
      if (!user) {
        res.status(401).json({ message: "No user found with this Google ID" });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("authMiddleware - Google token verification error:", error);
      res.status(401).json({ message: "Not authorized, Google token failed" });
    }
  }
};
