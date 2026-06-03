import bcrypt from "bcryptjs";
import { BadRequestError, UnauthorizedError } from "../errors";
import { authRepository } from "../repositories/authRepository";
import { userRepository } from "../repositories/userRepository";

const MIN_PASSWORD_LENGTH = 8;

export const authService = {
  async registration(username: string, email: string, password: string) {
    if (!username || username.trim().length === 0)
      throw new BadRequestError("Username must not be empty");

    if (!email || email.trim().length === 0)
      throw new BadRequestError("Email must not be empty");

    if (!password || password.length < MIN_PASSWORD_LENGTH)
      throw new BadRequestError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );

    const userId = await authRepository.createUser(username, email, password);
    return userId;
  },

  async login(username: string, password: string) {
    if (!username || username.trim().length === 0)
      throw new BadRequestError("Username must not be empty");

    if (!password || password.length === 0)
      throw new BadRequestError("Password must not be empty");

    const user = await userRepository
      .findUserByUsername(username)
      .catch(() => null);

    if (!user) throw new BadRequestError("Invalid username or password");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      throw new BadRequestError("Invalid username or password");

    return user.id;
  },
};
