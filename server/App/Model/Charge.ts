import { ChargeStatus } from "./Enum/ChargeStatus.js";

export class Charge 
{
    private readonly id: string;
    private readonly issuerWalletId: string;
    private readonly amount: number;
    private readonly description?: string;
    private status: ChargeStatus;
    private readonly expiresAt?: Date;
    private payerWalletId?: string;
    private paymentTransactionId?: string;
    private readonly createdAt: Date;
    private paidAt?: Date;

    constructor(
        id: string,
        issuerWalletId: string,
        amount: number,
        description?: string
    ) {
        this.id = id;
        this.issuerWalletId = issuerWalletId;
        this.amount = amount;
        this.description = description;
        this.status = ChargeStatus.OPEN;
        this.createdAt = new Date();
    }

    
}