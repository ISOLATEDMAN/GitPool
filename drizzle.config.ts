import { config } from "dotenv";


import { defineConfig } from "drizzle-kit";


config({ path: '.env' });

export default defineConfig({
  schema: "./db/schema.ts", // This is where we will define tables
  out: "./drizzle",         // Where migration files go
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});


