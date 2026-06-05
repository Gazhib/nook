import { Context } from "hono";
import { authService } from "../services/authService";
import { generateAndSetAccessToken } from "../middleware/token";
import { setCookie } from "hono/cookie";
import { BadRequestError } from "../errors";
import { readJsonBody } from "./roomControllers";

export function requireString(
  body: Record<string, unknown>,
  field: string
): string {
  const value = body[field];
  if (typeof value !== "string") {
    throw new BadRequestError(`Field "${field}" is required`);
  }
  return value;
}

export const authControllers = {
  async me(c: Context) {
    const userId = c.get("userId");

    if (userId) return c.json({ userId }, 200);
    return c.json({ error: "Unauthorized" }, 401);
  },

  async registration(c: Context) {
    const body = await readJsonBody(c);
    const username = requireString(body, "username");
    const email = requireString(body, "email");
    const password = requireString(body, "password");

    const userId = await authService.registration(username, email, password);
    const token = await generateAndSetAccessToken({ userId });

    setCookie(c, "access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return c.json({ message: "User was created successfully", username }, 200);
  },

  async login(c: Context) {
    const body = await readJsonBody(c);
    const username = requireString(body, "username");
    const password = requireString(body, "password");

    const userId = await authService.login(username, password);

    const token = await generateAndSetAccessToken({ userId });
    setCookie(c, "access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return c.json({ message: "Login was successful", username }, 200);
  },
};
