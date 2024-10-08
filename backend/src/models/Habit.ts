import mongoose, { Document, Schema } from "mongoose";

interface IHabit extends Document {
  title: string;
  description?: string;
  frequency: string; // Daily, Weekly, Monthly, etc.
  startDate: Date;
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user
  progress: Date[]; // Array di Date
}

const HabitSchema = new Schema<IHabit>(
  {
    title: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, required: true },
    startDate: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    progress: [{ type: Date }] // Define an array of Date
  },
  { timestamps: true }
);

export default mongoose.model<IHabit>("Habit", HabitSchema);
