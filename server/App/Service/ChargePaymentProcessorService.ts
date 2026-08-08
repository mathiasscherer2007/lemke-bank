import { ChargeNotFoundException } from "../Exception/DomainException.js";
import { Transaction } from "../Model/Transaction.js";
import { TransactionProcessorService } from "./TransactionProcessorService.js";

export class ChargePaymentProcessorService
{
    constructor(
        private readonly chargeRepository: ChargeRepository,
        private readonly payloadSignerService: PayloadSignerService
    ){}

    public async process(userId: string, signedPayload: string): Promise<Transaction>
    {
        
    }
}