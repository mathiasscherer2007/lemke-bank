import { ChargeAlreadyHasTransactionException, ChargePaidByIssuerException, ChargePaidOrExpiredException, TransactionAttachedToNotPaidCharge } from "../Exception/DomainException.js";
import { ChargeStatus } from "./Enum/ChargeStatus.js";

export class Charge 
{
    private readonly id: string;
    private readonly issuerWalletId: string;
    private readonly amount: number;
    private readonly description?: string | null;
    private status: ChargeStatus;
    private readonly expiresAt: Date;
    private payerWalletId?: string | null;
    private paymentTransactionId?: string | null;
    private readonly createdAt: Date;
    private paidAt?: Date | null;

    constructor(
        issuerWalletId: string,
        amount: number,
        description?: string | null,
        id?: string,
        status?: ChargeStatus,
        createdAt?: Date,
        expiresAt?: Date | null,
        payerWalletId?: string | null,
        paymentTransactionId?: string | null,
        paidAt?: Date | null,
    ) {
        this.id = id ?? crypto.randomUUID();
        this.issuerWalletId = issuerWalletId;
        this.amount = amount;
        this.description = description;
        this.status = status ?? ChargeStatus.OPEN;
        this.createdAt = createdAt ?? new Date();

        this.payerWalletId = payerWalletId;
        this.paymentTransactionId = paymentTransactionId;
        this.paidAt = paidAt;

        if(expiresAt){
            this.expiresAt = expiresAt;
        } else {
            this.expiresAt = new Date();
            this.expiresAt.setMinutes(this.expiresAt.getMinutes() + 30); // Set expiration to 30 minutes from creation
        }
    }

    public pay(payerWalletId: string): void 
    {
        if (this.status === ChargeStatus.PAID) {
            throw new ChargePaidOrExpiredException(this.id);
        } else if (this.status === ChargeStatus.EXPIRED || this.expiresAt < new Date()) {
            throw new ChargePaidOrExpiredException(this.id);
        } else if (this.issuerWalletId === payerWalletId) {
            throw new ChargePaidByIssuerException(this.issuerWalletId, this.id);
        }

        this.payerWalletId = payerWalletId;
        this.status = ChargeStatus.PAID;
        this.paidAt = new Date();
    }

    public attachTransaction(paymentTransactionId: string): void 
    {
        if (this.status !== ChargeStatus.PAID) {
            throw new TransactionAttachedToNotPaidCharge(this.id, paymentTransactionId);
        } else if(this.paymentTransactionId) {
            throw new ChargeAlreadyHasTransactionException(this.id, paymentTransactionId);
        }

        this.paymentTransactionId = paymentTransactionId;
    }

    public isExpired(): boolean
    {
        if(this.expiresAt < new Date()){
            this.status = ChargeStatus.EXPIRED;
            return true;
        }

        return false;
    }

    public toPrimitives(): Record<string, unknown>
    {
        return {
            ...this as Record<string, unknown>
        };
    }

    public getId(): string
    {
        return this.id;
    }

    public getIssuerWalletId(): string
    {
        return this.issuerWalletId;
    }

    public getAmount(): number 
    {
        return this.amount;
    }

    public getDescription(): string | null | undefined
    {
        return this.description;
    }
}