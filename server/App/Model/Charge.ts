import { ChargePaidOrExpiredException } from "../Exception/DomainException.js";
import { ChargeStatus } from "./Enum/ChargeStatus.js";

export class Charge 
{
    private readonly id: string;
    private readonly issuerWalletId: string;
    private readonly amount: number;
    private readonly description?: string;
    private status: ChargeStatus;
    private readonly expiresAt: Date;
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
        this.expiresAt = new Date();
        this.expiresAt.setMinutes(this.expiresAt.getMinutes() + 30); // Set expiration to 30 minutes from creation
    }

    public pay(payerWalletId: string): void {
        if (this.status !== ChargeStatus.PAID) {
            throw new ChargePaidOrExpiredException(this.id);
        } else if (this.expiresAt < new Date()) {
            throw new ChargePaidOrExpiredException(this.id);
        }

        this.payerWalletId = payerWalletId;
        this.status = ChargeStatus.PAID;
        this.paidAt = new Date();
    }

    attachTransaction(payerWalletId: string, paymentTransactionId: string): void {
        if (this.status !== ChargeStatus.PAID) {
            throw new ChargePaidOrExpiredException(this.id);
        }

        this.payerWalletId = payerWalletId;
        this.paymentTransactionId = paymentTransactionId;
    }
}