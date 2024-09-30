import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/habits", protect, (req, res) => {
  res.send("Protected route, access granted");
});

export default router;
