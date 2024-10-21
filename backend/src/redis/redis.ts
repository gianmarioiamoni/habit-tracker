import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

// Explicit connection to Redis (needed with the new API)
redisClient.connect().catch(console.error);

export default redisClient;
