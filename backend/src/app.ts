import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import setupSwagger from "./swagger";

import authRouter from "./routes/authRoutes";
import habitRouter from "./routes/habitRoutes";

const SERVER_URL = process.env.SERVER_URL || "https://localhost:5000"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure body parser
app.use(bodyParser.json());

// Swagger setup
setupSwagger(app);

// Routes config
app.use("/auth", authRouter);
app.use("/habits", habitRouter);


export default app;