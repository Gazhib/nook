import { Context } from "hono";
import { userService } from "../services/userService";

export const userControllers = {
  async getUserById(c: Context) {
    const userId = c.get("userId");

    if (!userId) {
      return c.json({ error: "User id is required" }, 400);
    }

    const user = await userService.findUserById(userId);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({ user, message: "User found successfully" }, 200);
  },
};
