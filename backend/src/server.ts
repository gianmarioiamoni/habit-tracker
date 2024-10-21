import mongoose from "mongoose";
import app from "./app";


const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "http://localhost:27017";


async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Database connected: ", MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();

