import { UserError } from "../errors";
import { userRepository } from "../repositories/userRepository";

export const userService = {
  async findUserById(userId: number) {
    if (!userId) throw new UserError("User id is not provided");
    const user = userRepository.findUserById(userId);
    return user;
  },
};
