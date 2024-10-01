// import express from "express";
import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";

// import setupSwagger from "./config/swagger";

// import authRouter from "./routes/authRoutes";
// import habitRouter from "./routes/habitRoutes";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Configure body parser
// app.use(bodyParser.json());

// // Swagger setup
// setupSwagger(app);

// // Routes config
// app.use('/auth', authRouter);
// app.use('/habits', habitRouter);

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

