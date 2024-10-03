import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, (req, res) => {
// router.get("/", (req, res) => {
  
  res.send("Protected route, access granted");
});

export default router;
