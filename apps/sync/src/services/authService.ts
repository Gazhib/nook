import bcrypt from "bcryptjs";
import { UserError } from "../errors";
import { authRepository } from "../repositories/authRepository";
import { userRepository } from "../repositories/userRepository";

export const authService = {
  async registration(username: string, email: string, password: string) {
    if (!username || username.trim().length === 0)
      throw new Error("Username must not be empty");

    if (!email || email.trim().length === 0)
      throw new Error("Username must not be empty");
    const userId = await authRepository.createUser(username, email, password);
    return userId;
  },

  async login(username: string, password: string) {
    if (!username || username.trim().length === 0)
      throw new Error("Username must not be empty");

    const user = await userRepository.findUserByUsername(username);

    if (!user) throw new Error("Username not found");

    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("Password is incorrect");

    return user.id;
  },
};
