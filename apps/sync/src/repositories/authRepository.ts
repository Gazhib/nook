import { db } from "..";
import { ConflictError, UserError } from "../errors";
import { hashPassword } from "../middleware/password";
import { users } from "../schemas";

/** Postgres unique-violation error code. */
const PG_UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === PG_UNIQUE_VIOLATION
  );
}

export const authRepository = {
  async createUser(username: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);

    let result;
    try {
      [result] = await db
        .insert(users)
        .values({ username, password: hashedPassword, email })
        .returning({ id: users.id });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictError("Username or email is already taken");
      }
      throw err;
    }

    if (!result?.id) throw new UserError("Could not create User");

    return result.id;
  },
};
