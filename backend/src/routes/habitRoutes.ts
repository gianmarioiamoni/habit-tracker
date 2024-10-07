import express from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from "../controllers/habitController";


const router = express.Router();

/**
 * @swagger
 * /habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Read a book"
 *               description:
 *                 type: string
 *                 example: "Read 10 pages of a book daily"
 *               frequency:
 *                 type: string
 *                 example: "daily"
 *     responses:
 *       201:
 *         description: Habit successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.post("/", protect, createHabit);

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Get all habits for the authenticated user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of habits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.get("/", protect, getHabits);

/**
 * @swagger
 * /habits/{habitId}:
 *   put:
 *     summary: Update an existing habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: habitId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "614c1b7e4f1a5c001f4d84d8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Go for a walk"
 *               description:
 *                 type: string
 *                 example: "Walk 5 kilometers daily"
 *               frequency:
 *                 type: string
 *                 example: "daily"
 *     responses:
 *       200:
 *         description: Habit successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.put("/:habitId", protect, updateHabit);

/**
 * @swagger
 * /habits/{habitId}:
 *   put:
 *     summary: Update an existing habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: habitId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "614c1b7e4f1a5c001f4d84d8"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Go for a walk"
 *               description:
 *                 type: string
 *                 example: "Walk 5 kilometers daily"
 *               frequency:
 *                 type: string
 *                 example: "daily"
 *     responses:
 *       200:
 *         description: Habit successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.delete("/:habitId", protect, deleteHabit);

export default router;


