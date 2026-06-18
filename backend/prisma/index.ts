import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../generated/prisma/client";

const database_url = process.env.DATABASE_URL;

if (!database_url) {
  throw new Error("DATABASE_URL cannot be empty!");
}

const adapter = new PrismaBetterSqlite3({ url: database_url });
const prisma = new PrismaClient({ adapter });

export default prisma;
