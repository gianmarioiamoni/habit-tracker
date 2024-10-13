import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/Users"; 

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.authToken) {
    try {
      // Retieve the token from cookies
      token = req.cookies.authToken;

      // Decode the JWT token
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
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
