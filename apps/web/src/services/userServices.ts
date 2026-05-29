import { client } from "./client";

interface User {
  id: string;
  username: string;
}


export const getUserByUsername = (username: string) => {
  client.get<User>('/users/')
}


