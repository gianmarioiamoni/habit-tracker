import { Request, Response } from "express";
import Habit from "../models/Habit";

export const createHabit = async (req: Request, res: Response) => {
  try {
    const { title, description, frequency, startDate } = req.body;
    
    const userId = req.user?._id;
    // Assuming user is attached to request by the authMiddleware

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
      res.status(404).json({ error: "Habit not found" }); 
      return;
    }
    res.status(200).json({ message: "Habit deleted successfully" }); 
  } catch (error) {
    res.status(500).json({ error: "Failed to delete habit" }); 
  }
};

export const completeHabit = async (req: Request, res: Response): Promise<void> => {
  const { habitId } = req.params;
  const habit = await Habit.findById(habitId);

  if (!habit) {
    res.status(404).json({ message: "Habit not found" });
  } else {
    // Add the current date to the 'progress' field
    habit.progress.push(new Date());
    await habit.save();

    res.json(habit);
  }
};

// export const getDashboardData = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;

//     // Find all habits for the user
//     const habits = await Habit.find({ userId });

//     // Compute total number of days completed by the user for each habit
//     const totalDaysCompleted = habits.reduce((acc, habit) => {
//       return acc + habit.progress.length;
//     }, 0);

//     // Find the top 3 most frequent habits
//     const mostFrequentHabit = habits
//       .sort((a, b) => b.progress.length - a.progress.length)
//       .slice(0, 3); // Slice to get the top 3

    
//     res.status(200).json({
//       totalHabits: habits.length,
//       totalDaysCompleted,
//       mostFrequentHabit,
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     res.status(500).json({ message: "Failed to fetch dashboard data" });
//   }
// };

export const getDashboardData = async (req: Request, res: Response) => {
  const { timeFilter } = req.query;
  console.log("getDashboardData: timeFilter:", timeFilter);
  let date;
  const today = new Date();

  // Set start date based on the selected filter
  if (timeFilter === "7") {
    date = new Date(today.setDate(today.getDate() - 7));
  } else if (timeFilter === "30") {
    date = new Date(today.setDate(today.getDate() - 30));
  } else {
    date = null; // No flter stands for "all"
  }

  console.log(`getDashboardData: timeFilter: ${timeFilter}, startDate: ${date}`);

  // Create the query to get the filtered data
  let query = {};
  if (date) {
    query = { startDate: { $gte: date } }; // Filter by date
  }

  console.log(`getDashboardData: query: ${JSON.stringify(query)}`);

  try {
    // Find all habits for the user

    const habits = await Habit.find(query).populate("userId");
    console.log(`getDashboardData: habits: ${JSON.stringify(habits)}`);
    const totalHabits = habits.length;
    const totalDaysCompleted = habits.reduce(
      (acc, habit) => acc + habit.progress.length,
      0
    );
    const mostFrequentHabit = habits.slice(0, 5); // select 5 most frequent habits

    console.log(
      `getDashboardData: totalHabits: ${totalHabits}, totalDaysCompleted: ${totalDaysCompleted}, mostFrequentHabit: ${JSON.stringify(
        mostFrequentHabit
      )}`
    );

    res.json({
      totalHabits,
      totalDaysCompleted,
      mostFrequentHabit,
    });
  } catch (error) {
    console.error(`getDashboardData: error: ${error}`);
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};



