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
    console.log(err);
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
    console.log(err);
  }
};

export const me = async () => {
  try {
    const me = await client.get("/auth/me", {
      credentials: "include",
    });
    return me;
  } catch {
    return null;
  }
};
