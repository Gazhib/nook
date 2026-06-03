import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schemas";
import { NotFoundError, UserError } from "../errors";

export const userRepository = {
  async findUserById(ownerId: string) {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarURL,
      })
      .from(users)
      .where(eq(users.id, ownerId))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");

    return user;
  },

  async findUserByUsername(username: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");

    return user;
  },
};
