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

describe("Authentication API", () => {
  it("should create a new user and return a token", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should return an error if the email is already taken", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
