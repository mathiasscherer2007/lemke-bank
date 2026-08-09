import { UserRepository } from "../../Repository/User/UserRepository.js";
import { User } from "../../Model/User.js";
import { createHash } from "crypto";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
    constructor(@inject('UserRepository') private users: UserRepository) {}

    public async execute(input: { email: string; password: string; username: string }): Promise<User> {
        const existing = await this.users.findByEmail(input.email);
        if(existing) throw new Error('UserAlreadyExists');

        const passwordHash = createHash('sha256').update(input.password).digest('hex');

        const user = new User(
          crypto.randomUUID(), 
          input.email, 
          passwordHash, 
          input.username
        );

        await this.users.save(user);

        return user;
    }
}
