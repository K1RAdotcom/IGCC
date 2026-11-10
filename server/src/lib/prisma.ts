import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DB_POOL_MAX } from "./dbConfig";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: DB_POOL_MAX,
});

export const prisma = new PrismaClient({ adapter });