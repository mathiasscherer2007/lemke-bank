import { PaymentByWalletIdDTO, BatchPaymentDTO } from "../Dto/Request.js";
import { InsufficientFundsException, NotABusinessDayException, TransactionOriginEqualsDestinationException, WalletNotFoundException } from "../Exception/DomainException.js";
import { LedgerEntryType } from "../Model/Enum/LedgerEntryType.js";
import { LedgerEntry } from "../Model/LedgerEntry.js";
import { Wallet } from "../Model/Wallet.js";
import { Transaction } from "../Model/Transaction.js";
import { TransactionRepository } from "../Repository/Transaction/TransactionRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { BusinessDayService } from "./WebService/BusinessDay/BusinessDayService.js";

export class TransactionProcessorService
{
    constructor(
        private readonly transactionRepository: TransactionRepository,
        private readonly walletRepository: WalletRepository,
        private readonly businessDayService: BusinessDayService
    ){}

    public async process(paymentPayload: PaymentByWalletIdDTO, userId: string): Promise<Transaction>
    {
        const today = new Date();
        if(!await this.businessDayService.isBusinessDay(today)){
            throw new NotABusinessDayException();
        }

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

        if(!fromWallet) throw new WalletNotFoundException(undefined, userId);
        if(!toWallet) throw new WalletNotFoundException(toWalletId);
        if(fromWallet.getId() === toWallet.getId()) throw new TransactionOriginEqualsDestinationException(fromWallet.getId());

        if(!fromWallet.hasEnoughBalance(amount)){
            throw new InsufficientFundsException();
        }

        const entries = [];

        let entry = new LedgerEntry(
            fromWallet.getId(), 
            toWalletId, 
            LedgerEntryType.DEBIT, 
            amount,
            fromWallet.getBalance()
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

    public async processBatch(paymentPayload: BatchPaymentDTO, userId: string): Promise<Transaction>
    {
        const today = new Date();
        if (!await this.businessDayService.isBusinessDay(today)) {
            throw new NotABusinessDayException();
        }

        const { walletIds, amount, description } = paymentPayload;

        const entries = await this.generateBatchEntries(
            walletIds,
            amount,
            userId
        );

        const transaction = new Transaction(entries, description);

        await this.transactionRepository.create(transaction);

        const createdTransaction =
            await this.transactionRepository.findById(transaction.getId());

        return createdTransaction!;
    }

    private async generateBatchEntries(walletIds: string[], amount: number, userId: string): Promise<LedgerEntry[]>
    {
        const fromWallet = await this.walletRepository.findByUserId(userId);

        if (!fromWallet) {
            throw new WalletNotFoundException(undefined, userId);
        }

        const toWallets: Wallet[] = [];

        for (const walletId of walletIds) {
            const wallet = await this.walletRepository.findById(walletId);

            if (!wallet) {
                throw new WalletNotFoundException(walletId);
            }

            toWallets.push(wallet);
        }

        const totalAmount = amount * toWallets.length;

        if (!fromWallet.hasEnoughBalance(totalAmount)) {
            throw new InsufficientFundsException();
        }

        const entries: LedgerEntry[] = [];

        entries.push(
            new LedgerEntry(
                fromWallet.getId(),
                toWallets[0].getId(),
                LedgerEntryType.DEBIT,
                totalAmount
            )
        );

        for (const wallet of toWallets) {
            entries.push(
                new LedgerEntry(
                    wallet.getId(),
                    fromWallet.getId(),
                    LedgerEntryType.CREDIT,
                    amount,
                    wallet.getBalance()
                )
            );
        }

        return entries;
    }
}