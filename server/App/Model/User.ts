import { injectable } from "tsyringe";

@injectable()
export class User {
    private id: string;
    private email: string;
    private passwordHash: string;
    private username: string;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    constructor(
        id: string,
        email: string,
        passwordHash: string,
        username: string,
        createdAt?: Date,
        updatedAt?: Date
    ){
        this.id = id ?? crypto.randomUUID();
        this.email = email;
        this.passwordHash = passwordHash;
        this.username = username;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public getId(): string { return this.id; }
    public getEmail(): string { return this.email; }
    public getPasswordHash(): string { return this.passwordHash; }
    public getUsername(): string { return this.username; }

    public toPrimitives() {
        return {
            id: this.id,
            email: this.email,
            passwordHash: this.passwordHash,
            username: this.username,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
