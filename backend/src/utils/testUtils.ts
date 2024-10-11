import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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
