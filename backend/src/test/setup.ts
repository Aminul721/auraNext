process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/aura_humanoid_test";
process.env.PORT = "5000";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.JWT_ACCESS_SECRET = "unit-test-secret-only-not-for-use-outside-tests";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";

import { afterAll, beforeAll } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri("aura_humanoid_test");
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
