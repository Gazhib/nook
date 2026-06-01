import { UserError } from "../errors";
import { authRepository } from "../repositories/authRepository";

export const authService = {
  async registration(username: string, email: string, password: string) {
    if (!username) throw new UserError("Username is not provided");
    authRepository.createUser(username, email, password);
  },
};
