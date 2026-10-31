import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri);

const database: Db = client.db(
  process.env.DATABASE_NAME || "socialimpact"
);

export const connectDB = async (): Promise<Db> => {
  try {
    await client.connect();

    await database.command({ ping: 1 });

    console.log("MongoDB connected successfully");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const getDB = (): Db => database;