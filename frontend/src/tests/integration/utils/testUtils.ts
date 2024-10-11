import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connects to an in-memory MongoDB instance.
 */
export const connectDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create(); // Crea un'istanza di MongoDB in memoria
  const uri = mongoServer.getUri(); // Ottiene l'URI dell'istanza di MongoDB in memoria

  // Connette Mongoose al database in memoria
  await mongoose.connect(uri);
};

/**
 * Closes the connection to MongoDB and stops the in-memory server.
 */
export const closeDB = async (): Promise<void> => {
  // Disconnette Mongoose
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  // Ferma l'istanza di MongoDB in memoria
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Clears all the data from all collections in MongoDB.
 */
export const clearDB = async (): Promise<void> => {
  const collections = mongoose.connection.collections;

  // Cancella i dati di tutte le collection
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Funzione per generare un token JWT fittizio
export const generateToken = (): string => {
  // Dati che vuoi includere nel payload del token
  const payload = {
    id: 'mockUserId', // Puoi sostituirlo con un vero ID utente durante i test
    email: 'mockuser@example.com', // Email fittizia per il test
  };

  // Generazione del token con una chiave segreta e un tempo di scadenza
  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'testSecret', // Chiave segreta di fallback per i test
    { expiresIn: '1h' } // Token valido per 1 ora
  );

  return token;
};
