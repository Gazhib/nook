import { db } from "..";
import { UserError } from "../errors";
import { hashPassword } from "../middleware/password";
import { users } from "../schemas";

export const authRepository = {
  async createUser(username: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);

    const result = await db
      .insert(users)
      .values({ username, password: hashedPassword, email });

    if (result.rowCount !== 1) throw new UserError("Could not create User");
  },
};
