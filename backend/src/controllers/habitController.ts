import { Request, Response } from "express";
import Habit from "../models/Habit";

export const createHabit = async (req: Request, res: Response) => {
  try {
      const { title, description, frequency, startDate } = req.body;
      console.log("createHabit() - req.body:", req.body);
      
      const userId = req.user?._id;
      // Assuming user is attached to request by the authMiddleware
      console.log("createHabit() - userId:", userId);
    const newHabit = new Habit({
      title,
      description,
      frequency,
      startDate,
      userId,
    });
      
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ error: "Failed to create habit" });
  }
};


export const getHabits = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const habits = await Habit.find({ userId });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
};

export const updateHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { habitId } = req.params;
    const updatedHabit = await Habit.findByIdAndUpdate(habitId, req.body, {
      new: true,
    });
    if (!updatedHabit) {
      res.status(404).json({ error: "Habit not found" }); // Invia risposta senza restituire esplicitamente
      return;
    }
    res.status(200).json(updatedHabit); // Invia risposta
  } catch (error) {
    res.status(500).json({ error: "Failed to update habit" }); // Invia risposta
  }
};


export const deleteHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { habitId } = req.params;
    const deletedHabit = await Habit.findByIdAndDelete(habitId);
    if (!deletedHabit) {
      res.status(404).json({ error: "Habit not found" }); // Invia risposta senza return
      return;
    }
    res.status(200).json({ message: "Habit deleted successfully" }); // Invia risposta
  } catch (error) {
    res.status(500).json({ error: "Failed to delete habit" }); // Invia risposta
  }
};

