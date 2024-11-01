import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  completeHabit,
  getDashboardData,
  getDailyProgressData,
  getWeeklyOrMonthlyProgressData,
  getHabitCompletionPercentages
} from "../controllers/habitControllers";


const router = express.Router();

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.put("/:habitId", protect, updateHabit);
router.delete("/:habitId", protect, deleteHabit);
router.put("/:habitId/complete", protect, completeHabit);

router.get("/dashboard", protect, getDashboardData);
router.get("/dashboard/daily-progress", protect, getDailyProgressData);
router.get("/dashboard/weekly-or-monthly-progress", protect, getWeeklyOrMonthlyProgressData);
router.get("/dashboard/completion-percentages", protect, getHabitCompletionPercentages);

export default router;


