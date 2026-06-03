import { client } from "./client";

interface User {
  id: string;
  username: string;
}

interface GetUserByIdResponse {
  user: User;
  message: string;
}

export const getUserByIdService = async () => {
  const res = await client.get<GetUserByIdResponse>("/users");
  return res.user;
};
