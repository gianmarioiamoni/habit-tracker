import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface definition
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Rendilo opzionale per utenti OAuth
  googleId?: string; // Aggiungi il campo per memorizzare l'ID di Google
  iv?: string; // Può essere usato per crittografia (se necessario)
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Password opzionale
  },
  googleId: {
    type: String, // Campo per memorizzare l'ID dell'utente Google
    unique: true, // Deve essere unico
    sparse: true, // Campo opzionale, ma deve essere unico se presente
  },
  iv: { type: String },
});

// Method to confirm password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  // Se l'utente non ha password, blocca la comparazione
  if (!this.password) {
    throw new Error("User does not have a password");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware for password hashing before saving
userSchema.pre("save", async function (next) {
  // If the password is not modified or is empty (Google authentication), skip hashing
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const user = this as unknown as IUser;
  // user.password = await bcrypt.hash(user.password, salt);
  if (user.password === undefined) {
    throw new Error("User password is undefined");
  }
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
