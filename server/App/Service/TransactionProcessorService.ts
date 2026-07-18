import { PaymentByWalletIdDTO } from "../Dto/Request.js";
import { InsufficientFundsException } from "../Exception/DomainException.js";
import { LedgerEntryType } from "../Model/Enum/LedgerEntryType.js";
import { LedgerEntry } from "../Model/LedgerEntry.js";
import { Transaction } from "../Model/Transaction.js";
import { TransactionRepository } from "../Repository/Transaction/TransactionRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class TransactionProcessorService
{
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly walletRepository: WalletRepository
    ){}

    public async processByWalletId(paymentPayload: PaymentByWalletIdDTO, userId: string): Promise<Transaction>
    {
        const { toWalletId, amount, description } = paymentPayload;
        const entries = await this.generateEntries(toWalletId, amount, userId);

        const transaction = new Transaction(entries, description);
        await this.transactionRepository.create(transaction);
        
        const createdTransaction = await this.transactionRepository.findById(transaction.getId());
        return createdTransaction!;
    }


    private async generateEntries(toWalletId: string, amount: number, userId: string): Promise<LedgerEntry[]>
    {
        const fromWallet = await this.walletRepository.findByUserId(userId);
        const toWallet = await this.walletRepository.findById(toWalletId);

        if(!fromWallet.hasEnoughBalance(amount)){
            throw new InsufficientFundsException();
        }

        const entries = [];

        let entry = new LedgerEntry(
            fromWallet.getId(), 
            toWalletId, 
            LedgerEntryType.DEBIT, 
            amount
        )

        entries.push(entry);

        entry = new LedgerEntry(
            toWalletId,
            fromWallet.getId(),
            LedgerEntryType.CREDIT,
            amount,
            toWallet.getBalance()
        )

        entries.push(entry);
        return entries;
    }
}