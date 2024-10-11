import request from "supertest";
import app from "../../app"; // Importa la tua app Express
import { connectDB, closeDB, clearDB } from "../../utils/testUtils"; // Funzioni per gestire il database nei test

// Mock del middleware di autenticazione
jest.mock("../../middleware/authMiddleware", () => ({
  protect: (req: any, res: any, next: any) => {
    req.user = { _id: "mockUserId" }; // Simula l'utente autenticato
    next();
  },
}));

// Mock di jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mockToken"), // Mock per la generazione del token
  verify: jest.fn(() => ({ id: "mockUserId" })), // Mock per la verifica del token
}));

describe("Habit tracking functionality", () => {
  let token: string;

  beforeAll(async () => {
    await connectDB();
    token = "mockToken"; // Simula un token JWT fittizio
  }, 10000);

  afterAll(async () => {
    await closeDB(); // Chiusura del DB dopo i test
  }, 10000);

  afterEach(async () => {
    await clearDB(); // Pulizia del DB tra un test e l'altro
  }, 10000);

  it("should add a completion date to a habit", async () => {
    // Simula la creazione di una habit
    const newHabit = await request(app)
      .post("/habits")
      .set("Authorization", `Bearer ${token}`) // Usa il token nel header
      .send({ title: "Test Habit", description: "Testing habit tracking" })
      .expect(201);

    // Aggiungi una data di completamento alla habit
    const response = await request(app)
      .post(`/habits/${newHabit.body._id}/complete`)
      .set("Authorization", `Bearer ${token}`) // Usa il token nel header
      .send({ date: new Date().toISOString() })
      .expect(200);

    // Controlla che la response contenga la data di completamento
    expect(response.body.progress).toHaveLength(1);
    expect(new Date(response.body.progress[0])).toBeInstanceOf(Date);
  });

  it("should delete a completion date from a habit", async () => {
    // Simula la creazione di una habit con progress
    const newHabit = await request(app)
      .post("/habits")
      .set("Authorization", `Bearer ${token}`) // Usa il token nel header
      .send({
        title: "Test Habit",
        description: "Testing habit tracking",
        progress: [new Date().toISOString()],
      })
      .expect(201);

    const progressDate = newHabit.body.progress[0];

    // Elimina una data di completamento
    const response = await request(app)
      .delete(`/habits/${newHabit.body._id}/progress/${progressDate}`)
      .set("Authorization", `Bearer ${token}`) // Usa il token nel header
      .expect(200);

    // Controlla che la data sia stata rimossa
    expect(response.body.progress).toHaveLength(0);
  });
});
