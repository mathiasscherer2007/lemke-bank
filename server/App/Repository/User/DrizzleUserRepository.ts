import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../Config/Database/connection.js";
import { users } from "../../../Config/Database/Schema/users.js";
import { User } from "../../Model/User.js";
import { UserRepository } from "./UserRepository.js";
import { UserRole } from "../../Model/Enum/UserRole.js";
import { UserStatus } from "../../Model/Enum/UserStatus.js";
import { wallets } from "../../../Config/Database/Schema/wallets.js";
import { SearchedUser } from "../../../Config/Types/domain.js";

export class DrizzleUserRepository implements UserRepository {
    public async findById(id: string): Promise<User | null> {
        const rows = await db.select().from(users).where(and(eq(users.id, id), eq(users.status, UserStatus.ACTIVE)));
        if (rows.length <= 0) return null;
        const row = rows[0];
        return new User(
          row.email, 
          row.passwordHash, 
          row.username,
          row.role as UserRole,
          row.id,
          row.status as UserStatus,
          row.createdAt, 
          row.updatedAt
        );
    }

    public async findByEmail(email: string): Promise<User | null> {
        const rows = await db.select().from(users).where(and(eq(users.email, email), eq(users.status, UserStatus.ACTIVE)));
        if(rows.length <= 0) return null;
        const row = rows[0];
        return new User(
          row.email, 
          row.passwordHash, 
          row.username,
          row.role as UserRole,
          row.id,
          row.status as UserStatus,
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

    public async update(user: User): Promise<void> {
        const primitive = user.toPrimitives() as any;
        await db.update(users).set(primitive).where(eq(users.id, primitive.id));
    }

    public async search(query: string, limit: number): Promise<SearchedUser[]> {
        const rows = await db
        .select({
            id: users.id,
            email: users.email,
            username: users.username,
            walletId: wallets.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users)
        .innerJoin(wallets, eq(users.id, wallets.userId))
        .where(
            sql`MATCH(${users.username}, ${users.email}) AGAINST (${query} IN NATURAL LANGUAGE MODE) AND ${users.status} = ${UserStatus.ACTIVE}`
        )
        .limit(limit);

        return rows;
    }

}
