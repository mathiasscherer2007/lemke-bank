import { UserRole } from "./Enum/UserRole.js";
import { UserStatus } from "./Enum/UserStatus.js";

export class User {
    private id: string;
    private email: string;
    private passwordHash: string;
    private username: string;
    private readonly role: UserRole;
    private status: UserStatus;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    constructor(
        email: string,
        passwordHash: string,
        username: string,
        role: UserRole,
        id?: string,
        status?: UserStatus,
        createdAt?: Date,
        updatedAt?: Date
    ){
        this.id = id ?? crypto.randomUUID();
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
        this.role = role;
        this.status = status ?? UserStatus.ACTIVE;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getId(): string { return this.id; }
    public getEmail(): string { return this.email; }
    public getPasswordHash(): string { return this.passwordHash; }
    public getUsername(): string { return this.username; }
    public getRole(): UserRole { return this.role; }

    public toPrimitives(): Record<string, unknown>
    {
        return {
            ...this as Record<string, unknown>,
        };
    }

    public setStatus(status: UserStatus): void {
        this.status = status;
    }
}