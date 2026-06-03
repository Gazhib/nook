import { UserError } from "../errors";
import { userRepository } from "../repositories/userRepository";

export const userService = {
  async findUserById(userId: string) {
    if (!userId) throw new UserError("User id is not provided");
    const user = await userRepository.findUserById(userId);
    return user;
  },
};
