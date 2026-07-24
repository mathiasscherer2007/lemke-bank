import { eq } from "drizzle-orm";
import { db } from "../../../Config/Database/connection.js";
import { users } from "../../../Config/Database/Schema/users.js";
import { User } from "../../Model/User.js";
import { UserRepository } from "./UserRepository.js";
import { injectable } from "tsyringe";

@injectable()
export class DrizzleUserRepository implements UserRepository {
    public async findById(id: string): Promise<User | null> {
        const rows = await db.select().from(users).where(eq(users.id, id));
        if (rows.length <= 0) return null;
        const row = rows[0];
        return new User(
          row.id, 
          row.email, 
          row.passwordHash, 
          row.username, 
          row.createdAt, 
          row.updatedAt
        );
    }

    public async findByEmail(email: string): Promise<User | null> {
        const rows = await db.select().from(users).where(eq(users.email, email));
        if(rows.length <= 0) return null;
        const row = rows[0];
        return new User(
          row.id, 
          row.email, 
          row.passwordHash, 
          row.username, 
          row.createdAt, 
          row.updatedAt
        );
    }

    public async save(user: User): Promise<User> {
        const primitive = user.toPrimitives() as any;
        await db.insert(users).values({
            id: primitive.id,
            email: primitive.email,
            username: primitive.username,
            passwordHash: primitive.passwordHash,
        });
        return user;
    }

}
