export class Wallet 
{
    constructor(
        private id: string,
        private userId: string,
        private balance: number,
        private status: 'active' | 'disabled',
        private createdAt: Date,
        private updatedAt: Date
    ){}

    public haveEnoughBalance(amount: number): boolean {
        return this.balance >= amount;
    }
}