import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import http from "http";
import { describe, it } from "node:test";
import { expect } from "@jest/globals";

let server: http.Server;

async function connectToDB() {
  const MONGO_URL = "mongodb://localhost:27017/habit-tracker-test"; // use test db
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Database connected: ", MONGO_URL);
    server = app.listen(5000, () => {
      console.log("Test server running on port 5000");
    });
  } catch (err) {
    console.error(err);
  }
}

beforeAll(() => {
  connectToDB();
});

afterAll((done) => {
  console.log("Closing server...");

  if (server) {
    server.close();
  }

  console.log("Server closed");

  // disconnecting from the database
  async function disconnectFromDB() {
    await mongoose.disconnect();
  }

  disconnectFromDB();
  // await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
  it("should login an existing user and return a token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "existinguser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return a 400 error if the email or password is incorrect", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "wrongemail@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });
});
