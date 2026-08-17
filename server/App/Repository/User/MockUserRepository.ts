import { User } from "../../Model/User.js";
import { UserRepository } from "./UserRepository.js";

export class MockUserRepository implements UserRepository 
{
    public readonly savedUsers: User[] = [];    
    private readonly usersByEmail = new Map<string, User>

    public async findById(id: string): Promise<User | null> {
        return this.savedUsers.find((user) => user.getId() === id) ?? null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.usersByEmail.get(email) ?? null;
    }

    public async save(user: User): Promise<User> {
        this.savedUsers.push(user);
        this.usersByEmail.set(user.getEmail(), user);
        return user;
    }

    public seed(user: User): void {
        this.usersByEmail.set(user.getEmail(), user);

    }
}