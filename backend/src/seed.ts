import mongoose from "mongoose";
import User from "./models/Users"; // Importa il model User
import Habit from "./models/Habit"; // Importa il model Habit

import dotenv from "dotenv"

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "http://localhost:27017";

// Connessione al database
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

async function populateHabits() {
  try {
    // Step 1: Delete existing habits 
    await Habit.deleteMany({});
    console.log("Existing habits cleared.");

    // Step 2: Retrieve existing users
    const users = await User.find({});
    if (users.length === 0) {
      console.error("No users found in the database.");
      return;
    }

    // Step 3: Creat new habits per each user
    const habitsData = [
      {
        title: "Morning Exercise",
        description: "Daily morning workout for 30 minutes",
        frequency: "Daily",
        startDate: new Date("2024-01-01"),
      },
      {
        title: "Read a Book",
        description: "Read for 15 minutes",
        frequency: "Daily",
        startDate: new Date("2024-01-05"),
      },
      {
        title: "Weekly Team Meeting",
        description: "Attend weekly meeting with the project team",
        frequency: "Weekly",
        startDate: new Date("2024-01-03"),
      },
      {
        title: "Grocery Shopping",
        description: "Buy groceries for the week",
        frequency: "Weekly",
        startDate: new Date("2024-01-06"),
      },
      {
        title: "Monthly Budget Review",
        description: "Review monthly expenses and savings",
        frequency: "Monthly",
        startDate: new Date("2024-01-01"),
      },
    ];

    // Per each user, create a series of habits
    for (const user of users) {
      const habits = habitsData.map((habit) => ({
        ...habit,
        userId: user._id,
        progress: generateRandomProgress(habit.startDate, habit.frequency),
      }));
      await Habit.insertMany(habits);
      console.log(`Habits populated for user: ${user.name}`);
    }
  } catch (error) {
    console.error("Error populating habits:", error);
  }
}

// Function to create habit progress realistic data
function generateRandomProgress(startDate: Date, frequency: string): Date[] {
  const progress: Date[] = [];
  const now = new Date();

  let current = new Date(startDate);
  while (current <= now) {
    progress.push(new Date(current));

    // Increase date based on the frequency
    if (frequency === "Daily") {
      current.setDate(current.getDate() + 1);
    } else if (frequency === "Weekly") {
      current.setDate(current.getDate() + 7);
    } else if (frequency === "Monthly") {
      current.setMonth(current.getMonth() + 1);
    }
  }
  return progress;
}

// run scripts
(async () => {
  await connectDB();
  await populateHabits();
  mongoose.disconnect();
})();
