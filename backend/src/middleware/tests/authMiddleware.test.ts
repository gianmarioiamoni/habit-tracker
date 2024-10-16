import { Request, Response, NextFunction } from "express";
import { protect } from "../authMiddleware"; // Importa il tuo middleware
import jwt from "jsonwebtoken";
import User from "../../models/Users"; // Assicurati di avere il tuo modello importato
import { config } from 'dotenv';

config({ path: '.env.test' }); // Carica le variabili dal file .env.test

jest.mock("../../models/Users"); // Mock del modello User

describe("protect middleware", () => {
  let req: Request; 
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    } as Request; // Casting per soddisfare il tipo
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if token is valid", async () => {
    const mockUser = { id: "userId", name: "Test User" };
    const token = jwt.sign(
      { id: mockUser.id },
      process.env.JWT_SECRET as string
    );
    if (!req.headers) {
      req.headers = {};
    } else {
      req.headers.authorization = `Bearer ${token}`;
    }
    // Mocka User.findById per restituire un utente
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      console.log("mockUser:", mockUser)

    await protect(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled(); // Verifica che next() sia stato chiamato
    expect(req.user).toEqual(mockUser); // Verifica che l'utente sia stato aggiunto a req
  });

  it("should return 401 if no token is provided", async () => {
    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, no token",
    });
    expect(next).not.toHaveBeenCalled(); // next non dovrebbe essere chiamato
  });

  it("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidToken";

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, token failed",
    });
    expect(next).not.toHaveBeenCalled(); // next non dovrebbe essere chiamato
  });
});
