import { defineConfig } from "drizzle-kit";
import "./src/loadEnv"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas.ts",
  out: "./src/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
