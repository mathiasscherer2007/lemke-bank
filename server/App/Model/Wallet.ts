export class Wallet 
{
    private readonly createdAt?: Date;
    private readonly updatedAt?: Date;
    private status: 'active' | 'disabled' = 'active';

    constructor(
        private id: string,
        private userId: string,
        private balance: number,
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