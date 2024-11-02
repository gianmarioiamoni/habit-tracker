import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  getDashboardData,
  getDailyProgressData,
  getWeeklyOrMonthlyProgressData,
  getHabitCompletionPercentages
} from "../controllers/habitsDashboardControllers";


const router = express.Router();

router.get("/", protect, getDashboardData);
router.get("/daily-progress", protect, getDailyProgressData);
router.get("/weekly-or-monthly-progress", protect, getWeeklyOrMonthlyProgressData);
router.get("/completion-percentages", protect, getHabitCompletionPercentages);

export default router;


