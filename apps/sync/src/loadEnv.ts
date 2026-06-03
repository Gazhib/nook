import * as path from "path"
import * as dotenv from "dotenv"

const envPath = path.resolve(process.cwd(), "../..", ".env")

dotenv.config({ path: envPath });

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const DATABASE_URL = requireEnv("DATABASE_URL");
export const JWT_ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
