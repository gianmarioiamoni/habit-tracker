import request from "supertest";
import app from "../../app"; // Importa la tua app Express
import User from "../../models/Users";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Mock di JWT
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"),
}));

// Mock di bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn((password: string, salt: number) => {
    return Promise.resolve(`hashed_${password}`); // Restituisce una stringa simulata
  }),
  genSalt: jest.fn(() => {
    return Promise.resolve(10); // Restituisce un valore di sale simulato
  }),
  compare: jest.fn(),
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
  await User.deleteMany(); // Pulisce i dati del database dopo ogni test
});

describe("Auth Controller", () => {

  describe(`POST /signup`, () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example2.com",
        password: "password123",
      };

      const response = await request(app).post(`/auth/signup`).send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.name).toBe(newUser.name);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should not allow registration with an existing email", async () => {
      const existingUser = new User({
        name: "Existing User",
        email: "test@example2.com",
        password: "password123",
      });
      await existingUser.save();

      const response = await request(app).post(`/auth/signup`).send({
        name: "New User",
        email: "test@example2.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe(`POST /login`, () => {
    it("should log in a user with correct credentials", async () => {
      const password = "password123"; // Usa la password corretta
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = new User({
        name: "Test User",
        email: "test@example2.com", // Usa l'email corretta
        password: hashedPassword,
      });
      await existingUser.save();

      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simula che la password sia corretta

      const response = await request(app).post(`/auth/login`).send({
        email: "test@example2.com",
        password: password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.email).toBe(existingUser.email);
      expect(response.body.name).toBe(existingUser.name);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should not log in a user with incorrect password", async () => {
      const password = "password123"; // Usa la password corretta
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = new User({
        name: "Test User",
        email: "test@example2.com",
        password: hashedPassword,
      });
      await existingUser.save();

      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simula che la password sia sbagliata

      const response = await request(app).post(`/auth/login`).send({
        email: "test@example2.com",
        password: "wrongpassword", // Password sbagliata
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should return 401 for non-existing users", async () => {
      const response = await request(app).post(`/auth/login`).send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
