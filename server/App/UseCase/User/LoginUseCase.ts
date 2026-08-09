import { createHash } from "node:crypto";
import { UserRepository } from "../../Repository/User/UserRepository.js";
import { inject, injectable } from "tsyringe";

type LoginInput = {
  email: string;
  password: string;
};

type LoginReply = {
  id: string;
  email: string;
  username: string;
};

@injectable()
export class LoginUseCase {
  constructor(@inject('UserRepository') private users: UserRepository) {}

  public async execute(input: LoginInput): Promise<LoginReply | null> {
    console.log('LoginUseCase.execute called with input:', input);
    const user = await this.users.findByEmail(input.email);
    if (!user) return null;

    console.log('User found:', user.toPrimitives());

    const passwordHash = createHash('sha256').update(input.password).digest('hex');
    if (user.getPasswordHash() !== passwordHash) return null;

    return {
      id: user.getId(),
      email: user.getEmail(),
      username: user.getUsername(),
    };
  }
}