import { User } from "../../Model/User.js";
import { UserStatus } from "../../Model/Enum/UserStatus.js";
import { SearchedUser } from "../../Types/domain.js";
import { UserRepository } from "./UserRepository.js";

export class MockUserRepository implements UserRepository 
{
    public readonly savedUsers: User[] = [];
    private readonly usersById = new Map<string, User>();
    private readonly usersByEmail = new Map<string, User>();
    private readonly walletIdsByUserId = new Map<string, string>();

    public async findById(id: string): Promise<User | null> {
        return this.usersById.get(id) ?? null;
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.usersByEmail.get(email) ?? null;
    }

    public async save(user: User): Promise<User> {
        this.savedUsers.push(user);
        this.usersById.set(user.getId(), user);
        this.usersByEmail.set(user.getEmail(), user);
        return user;
    }

    public async update(user: User): Promise<void> {
        if (!this.usersById.has(user.getId())) return;

        this.usersById.set(user.getId(), user);

        const savedUserIndex = this.savedUsers.findIndex(
            (storedUser) => storedUser.getId() === user.getId(),
        );
        if (savedUserIndex >= 0) {
            this.savedUsers[savedUserIndex] = user;
        }

        this.removeEmailIndexesForUser(user.getId(), user.getEmail());
        this.usersByEmail.set(user.getEmail(), user);
    }

    public async search(query: string, limit: number): Promise<SearchedUser[]> {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery || limit <= 0) return [];

        return Array.from(this.usersById.values())
            .filter((user) => {
                const primitives = user.toPrimitives() as Record<string, unknown>;
                const status = primitives.status ?? UserStatus.ACTIVE;
                const matchesQuery =
                    user.getUsername().toLowerCase().includes(normalizedQuery) ||
                    user.getEmail().toLowerCase().includes(normalizedQuery);

                return status === UserStatus.ACTIVE &&
                    this.walletIdsByUserId.has(user.getId()) &&
                    matchesQuery;
            })
            .slice(0, Math.floor(limit))
            .map((user) => {
                const primitives = user.toPrimitives() as Record<string, unknown>;
                const fallbackDate = new Date(0);

                return {
                    id: user.getId(),
                    email: user.getEmail(),
                    username: user.getUsername(),
                    walletId: this.walletIdsByUserId.get(user.getId())!,
                    createdAt: (primitives.createdAt as Date | undefined) ?? fallbackDate,
                    updatedAt: (primitives.updatedAt as Date | undefined) ?? fallbackDate,
                };
            });
    }

    public seed(user: User, walletId?: string): void {
        this.usersById.set(user.getId(), user);
        this.removeEmailIndexesForUser(user.getId(), user.getEmail());
        this.usersByEmail.set(user.getEmail(), user);

        if (walletId !== undefined) {
            this.walletIdsByUserId.set(user.getId(), walletId);
        }
    }

    private removeEmailIndexesForUser(userId: string, currentEmail: string): void {
        for (const [email, storedUser] of this.usersByEmail) {
            if (storedUser.getId() === userId && email !== currentEmail) {
                this.usersByEmail.delete(email);
            }
        }
    }
}
