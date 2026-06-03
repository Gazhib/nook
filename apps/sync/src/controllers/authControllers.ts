import { Context } from "hono";
import { authService } from "../services/authService";
import { generateAndSetAccessToken } from "../middleware/token";
import { setCookie } from "hono/cookie";

export const authControllers = {
  async me(c: Context) {
    const userId = c.get("userId");

    if (userId) return c.json({ userId }, 200);
    return c.json({ message: "Unauthorized" }, 401);
  },

  async registration(c: Context) {
    const { username, email, password } = await c.req.json();

    const userId = await authService.registration(username, email, password);
    const token = await generateAndSetAccessToken({ userId });

    setCookie(c, "access_token", token);

    return c.json({ message: "User was created successfully", username }, 200);
  },

  async login(c: Context) {
    const { username, password } = await c.req.json();

    const userId = await authService.login(username, password);

    const token = await generateAndSetAccessToken({ userId });
    setCookie(c, "access_token", token);

    return c.json({ message: "Login was successful", username }, 200);
  },
};
