import { User } from "../../Model/User.js";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
<<<<<<< HEAD
}
=======
}
>>>>>>> ed9f60a6e0b1a58d5fbc1f797f7a47b3db0c08aa
