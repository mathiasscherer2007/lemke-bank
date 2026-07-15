import { WalletStatus } from "./Enum/WalletStatus.js";

export class Wallet 
{
    private userId: string;
    private balance: number;
    private status: WalletStatus;
    private id?: string;
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    constructor(
        userId: string,
        status: WalletStatus = WalletStatus.ACTIVE,
        balance: number = 0,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date
    ){
        this.id = id ?? crypto.randomUUID();
        this.userId = userId;
        this.balance = balance;
        this.status = status
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public hasEnoughBalance(amount: number): boolean {
        return this.balance >= amount;
    }
}