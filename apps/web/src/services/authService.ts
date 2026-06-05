import { client } from "./client";

export const registerService = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    await client.post("/auth/registration", {
      username,
      email,
      password,
    });
  } catch (err) {
    throw err;
  }
};

export const loginService = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    await client.post("/auth/login", {
      username,
      password,
    });
  } catch (err) {
    throw err;
  }
};

export const meService = async (cookie?: string) => {
  try {
    const me = await client.get("/auth/me", {
      credentials: "include",
      // Next.js middleware runs server-side, where `credentials: "include"`
      // does nothing — there is no browser cookie jar. The incoming request's
      // cookies must be forwarded explicitly so the backend can read
      // `access_token`.
      headers: cookie ? { Cookie: cookie } : undefined,
    });
    return me;
  } catch {
    return null;
  }
};
