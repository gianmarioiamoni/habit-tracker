import request from "supertest";
import app from "../../App";
import { connectDB, closeDB, generateToken } from "./utils/testUtils";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe("GET /habits/dashboard", () => {
  it("should return the correct dashboard data for the user", async () => {
    const token = generateToken(); // Funzione per generare un token fittizio

    const response = await request(app)
      .get("/api/habits/dashboard")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.totalHabits).toBeDefined();
    expect(response.body.totalDaysCompleted).toBeDefined();
    expect(response.body.mostFrequentHabit).toBeInstanceOf(Array);
  });
});
