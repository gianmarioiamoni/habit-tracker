import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import setupSwagger from "./swagger";

import authRouter from "./routes/authRoutes";
import habitRouter from "./routes/habitRoutes";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000"; 

dotenv.config();

const app = express();

console.log("FRONTEND_URL: ", process.env.FRONTEND_URL)

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Assicurati che sia http://localhost:3000
    credentials: true, // Permetti l'invio dei cookie
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permetti i metodi che utilizzi
    allowedHeaders: ["Content-Type", "Authorization"], // Aggiungi tutti gli header necessari
  })
);

// Answer to the preflight (OPTIONS) for all requests with CORS
app.options("*", cors());

app.use(express.json());

app.use(cookieParser());

// Configure body parser
app.use(bodyParser.json());

// Swagger setup
setupSwagger(app);

// Routes config
app.use("/auth", authRouter);
app.use("/habits", habitRouter);


export default app;