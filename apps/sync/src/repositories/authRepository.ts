import { db } from "..";
import { UserError } from "../errors";
import { users } from "../schemas";

export const authRepository = {
  async createUser(username: string) {
    const result = await db.insert(users).values({ username });

    if (result.rowCount !== 1) throw new UserError("Could not create User");
  },
};
