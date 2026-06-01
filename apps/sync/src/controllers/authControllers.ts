import { Context } from "hono";
import { authService } from "../services/authService";

export const authControllers = {
  async registration(c: Context) {
    const { username, email, password } = await c.req.json();

    if (!username || username.trim().length === 0)
      throw new Error("Username must not be empty");

    if (!email || email.trim().length === 0)
      throw new Error("Username must not be empty");
    authService.registration(username, email, password);

    return c.json({ message: "User was created successfully", username });
  },
};
