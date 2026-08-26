import { User } from "../../Model/User.js";
import { SearchedUser } from "../../Types/domain.js";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<void>;
    search(query: string, limit: number): Promise<SearchedUser[]>;
    getTotalUsersCount(): Promise<number>;
}

export const UserRepository = 'UserRepository';