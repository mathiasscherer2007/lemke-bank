import { WalletStatus } from "./Enum/WalletStatus";

export class Wallet 
{
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;

    constructor(
        private id: string,
        private userId: string,
        private balance: number,
        private status: WalletStatus = WalletStatus.ACTIVE,
        createdAt?: Date,
        updatedAt?: Date
    ){
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public hasEnoughBalance(amount: number): boolean {
        return this.balance >= amount;
    }
}