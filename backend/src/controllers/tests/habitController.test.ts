import request from 'supertest';
import app from '../../app'; // Importa la tua app Express
import Habit from '../../models/Habit';
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(() => ({ id: "mockUserId" })), // Simula una decodifica del token
}));

jest.mock("../../middleware/authMiddleware", () => ({
  protect: (req: Request, res: Response, next: NextFunction) => {
    req.user = { _id: "mockUserId" }; // Simula un utente autenticato
    next();
  },
}));

describe('GET /habits', () => {

    it('should return a list of habits for the user', async () => {
        const mockHabits = [{ _id: '1', title: 'Habit 1' }, { _id: '2', title: 'Habit 2' }];
        Habit.find = jest.fn().mockResolvedValue(mockHabits);

        const response = await request(app)
            .get('/habits')
            .set('Authorization', 'Bearer mockToken'); // Aggiungi token

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockHabits);
    });

    it('should return a 500 error if fetching habits fails', async () => {
        Habit.find = jest.fn().mockRejectedValue(new Error('Failed to fetch habits'));

        const response = await request(app)
            .get('/habits')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to fetch habits');
    });
});

describe("Habit Controllers", () => {
  describe("POST /habits", () => {
    it("should create a new habit successfully", async () => {
      const mockHabit = {
        title: "Test Habit",
        description: "This is a test habit",
        frequency: "daily",
        startDate: "2024-01-01",
      };

      // Mock del metodo `save` di Mongoose
      jest.spyOn(Habit.prototype, "save").mockResolvedValue(mockHabit);

      const response = await request(app)
        .post("/habits")
        .send(mockHabit)
        .set("Authorization", "Bearer mockToken"); // Usa un mock token

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockHabit);
    });
  });
});

describe('PUT /habits/:habitId', () => {
    
    it('should update a habit successfully', async () => {
        const mockUpdatedHabit = { _id: '123', title: 'Updated Habit' };
        Habit.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedHabit);

        const response = await request(app)
            .put('/habits/123')
            .send({ title: 'Updated Habit' })
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedHabit);
    });

    it('should return 404 if habit is not found', async () => {
        Habit.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .put('/habits/123')
            .send({ title: 'Updated Habit' })
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Habit not found');
    });

    it('should return 500 if update fails', async () => {
        Habit.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Failed to update habit'));

        const response = await request(app)
            .put('/habits/123')
            .send({ title: 'Updated Habit' })
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to update habit');
    });
});

describe('DELETE /habits/:habitId', () => {

    it('should delete a habit successfully', async () => {
        Habit.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '123' });

        const response = await request(app)
            .delete('/habits/123')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Habit deleted successfully');
    });

    it('should return 404 if habit is not found', async () => {
        Habit.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .delete('/habits/123')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Habit not found');
    });

    it('should return 500 if deletion fails', async () => {
        Habit.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Failed to delete habit'));

        const response = await request(app)
            .delete('/habits/123')
            .set('Authorization', 'Bearer mockToken');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to delete habit');
    });
});