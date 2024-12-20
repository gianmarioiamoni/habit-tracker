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

export const getDashboardData = async (req: Request, res: Response) => {
  const { timeFilter } = req.query;
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

  // Create the query to get the filtered data
  let query = {};
  if (date) {
    query = { startDate: { $gte: date } }; // Filter by date
  }

  try {
    // Find all habits for the user

    const habits = await Habit.find(query).populate("userId");
    const totalHabits = habits.length;
    const totalDaysCompleted = habits.reduce(
      (acc, habit) => acc + habit.progress.length,
      0
    );
    const mostFrequentHabit = habits.slice(0, 5); // select 5 most frequent habits

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

export const getDailyProgressData = async (req: Request, res: Response) => {
  const { timeFilter } = req.query;
  const today = new Date();
  let startDate;

  if (timeFilter === "7") {
    startDate = new Date(today.setDate(today.getDate() - 7));
  } else if (timeFilter === "30") {
    startDate = new Date(today.setDate(today.getDate() - 30));
  } else {
    startDate = null; // or setup an appropriate starting date
  }

  try {
    const habits = await Habit.find({
      userId: req.user._id,
      startDate: { $gte: startDate },
    });

    // Create an object to store the daily progress
    const dailyProgress: Record<string, number> = {}; // an object type with keys of type string and values of type number

    habits.forEach((habit) => {
      habit.progress.forEach((progressDate) => {
        const dateKey = progressDate.toISOString().slice(0, 10); // Use date only
        dailyProgress[dateKey] = (dailyProgress[dateKey] || 0) + 1;
      });
    });

    res.json(dailyProgress);
  } catch (error) {
    console.error(`getDailyProgressData: error: ${error}`);
    res
      .status(500)
      .json({ message: "Error fetching daily progress data", error });
  }
};


export const getWeeklyOrMonthlyProgressData = async (
  req: Request,
  res: Response
) => {
  try {
    const { timeFilter } = req.params; // "weekly" or "monthly"
    const userId = req.user._id;

    // Establish the aggregation format based on the selected filter  
    const dateFormat = timeFilter === "weekly" ? "%Y-%U" : "%Y-%m"; // %U for week, %m for month

    // Pipeline di aggregazione
    const progressData = await Habit.aggregate([
      { $match: { userId, progress: { $exists: true, $ne: [] } } }, 
      { $unwind: "$progress" }, // Transform each data in progress in a distinct document
      {
        $group: {
          _id: {
            habitId: "$_id",
            period: {
              $dateToString: { format: dateFormat, date: "$progress" }, // Raggruppa per settimana o mese
            },
          },
          count: { $sum: 1 }, // Count completions per period
        },
      },
      {
        $group: {
          _id: "$_id.period",
          habits: {
            $push: {
              habitId: "$_id.habitId",
              count: "$count",
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // Sort by period
    ]);

    // Format data to make them more readable for the frontend
    const formattedData = progressData.map((item: any) => ({
      period: item._id,
      habits: item.habits.map((habit: any) => ({
        habitId: habit.habitId,
        count: habit.count,
      })),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error in getting weekly or monthly progress data:", error);
    res
      .status(500)
      .json({ message: "Error in getting weekly or monthly progress data" });
  }
};

export const getHabitCompletionPercentages = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;

    // Aggregation pipeline to compute completion percentages
    const completionData = await Habit.aggregate([
      { $match: { userId, progress: { $exists: true, $ne: [] } } }, 
      { $project: { title: 1, progressCount: { $size: "$progress" } } }, // Count comletion of each habit
      {
        $group: {
          _id: null,
          totalCompletions: { $sum: "$progressCount" }, // Sum of completions for all habits
          habits: {
            $push: {
              title: "$title",
              progressCount: "$progressCount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          habits: {
            $map: {
              input: "$habits",
              as: "habit",
              in: {
                title: "$$habit.title",
                completionPercentage: {
                  $cond: {
                    if: { $gt: ["$totalCompletions", 0] },
                    then: {
                      $multiply: [
                        {
                          $divide: [
                            "$$habit.progressCount",
                            "$totalCompletions",
                          ],
                        },
                        100,
                      ],
                    },
                    else: 0,
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.json(completionData[0]?.habits || []);
  } catch (error) {
    console.error("Error in getting habit completion percentages:", error);
    res
      .status(500)
      .json({ message: "Error in getting habit completion percentages" });
  }
};



