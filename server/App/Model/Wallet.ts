export class Wallet 
{
    private createdAt: Date | undefined;
    private updatedAt: Date | undefined;
    private status: 'active' | 'disabled' = 'active';

    constructor(
        private id: string,
        private userId: string,
        private balance: number,
    ){}

    public hasEnoughBalance(amount: number): boolean {
        return this.balance >= amount;
    }
}