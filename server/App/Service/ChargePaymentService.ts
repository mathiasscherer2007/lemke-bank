import { ChargeNotFoundException } from "../Exception/DomainException.js";
import { Charge } from "../Model/Charge.js";
import { Transaction } from "../Model/Transaction.js";
import { ChargeRepository } from "../Repository/Charge/ChargeRepository.js";
import { TransactionProcessorService } from "./TransactionProcessorService.js";

export class ChargePaymentService
{
    constructor(
        private readonly chargeRepository: ChargeRepository,
        private readonly transactionProcessorService: TransactionProcessorService
    ){}

    public async getData(chargeId: string): Promise<Charge>
    {
        const charge = await this.chargeRepository.findById(chargeId);

        if(!charge) throw new ChargeNotFoundException(chargeId);

        return charge;
    }

    public async makePaymentTransaction():  Promise<Transaction>
    {
        
    }
}