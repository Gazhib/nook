import * as path from "path"
import * as dotenv from "dotenv"

// __dirname is not available in ESM; drizzle-kit runs from the package dir,
// so go up two levels to the workspace root where .env lives.
const envPath = path.resolve(process.cwd(), "../..", ".env")

dotenv.config({ path: envPath });
