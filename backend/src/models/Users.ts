import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface definition
export interface IUser extends Document {
  name: string,
  email: string;
  password: string;
  iv: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  iv: { type: String, required: true },
});

// Method to confirm password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware for password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(this.password, salt);
  const user = this as unknown as IUser & { password: string };
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
