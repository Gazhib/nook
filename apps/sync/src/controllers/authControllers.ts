import { Context } from "hono";
import { authService } from "../services/authService";

export const authControllers = {
  async registration(c: Context) {
    const { username } = await c.req.json();

    if (!username || username.trim().length === 0)
      throw new Error("Username must not be empty");
    authService.registration(username);

    return c.json({ message: "User was created successfully", username });
  },
};
