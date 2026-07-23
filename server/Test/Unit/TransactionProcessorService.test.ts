import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { MockTransactionRepository } from "../../App/Repository/Transaction/MockTransactionRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";
import { LedgerEntryType } from "../../App/Model/Enum/LedgerEntryType.js";
import { InsufficientFundsException } from "../../App/Exception/DomainException.js";
import { PaymentByWalletIdDTO } from "../../App/Dto/Request.js";

const createTestWallet = (userId: string, balance: number, id?: string) => {
    return new Wallet(userId, WalletStatus.ACTIVE, balance, id);
};

const createPaymentDTO = (overrides?: Partial<PaymentByWalletIdDTO>): PaymentByWalletIdDTO => {
    return {
        toWalletId: "wallet-credit-uuid",
        amount: 100,
        description: "Test payment",
        ...overrides
    };
};

describe("TransactionProcessorService", () => {
    test("successfully processes payment with sufficient balance", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet, "user-123");
        await walletRepository.create(toWallet, "user-456");

        const transactionRepository = new MockTransactionRepository();

        const service = new TransactionProcessorService(transactionRepository, walletRepository);

        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: "Test payment"
        });

        // Execute
        const transaction = await service.processByWalletId(paymentDTO, "user-123");

        // Verify
        assert.ok(transaction, "Should return a transaction object");
        assert.strictEqual(transaction.getId(), transaction.getId(), "Transaction should have an ID");

        const entries = transaction.getEntries();
        assert.strictEqual(entries.length, 2, "Transaction should have 2 ledger entries");

        const debitEntry = entries.find(e => e.getType() === LedgerEntryType.DEBIT);
        const creditEntry = entries.find(e => e.getType() === LedgerEntryType.CREDIT);

        assert.ok(debitEntry, "Should have a DEBIT entry");
        assert.ok(creditEntry, "Should have a CREDIT entry");

        assert.strictEqual(debitEntry?.getWalletId(), fromWallet.getId(), "DEBIT entry should be from the user's wallet");
        assert.strictEqual(creditEntry?.getWalletId(), toWallet.getId(), "CREDIT entry should be to the target wallet");

        assert.strictEqual(debitEntry?.getAmount(), 100, "DEBIT entry amount should match the payment amount");
        assert.strictEqual(creditEntry?.getAmount(), 100, "CREDIT entry amount should match the payment amount");

        // Verify transaction is stored in repository
        const storedTransaction = await transactionRepository.findById(transaction.getId());
        assert.strictEqual(storedTransaction, transaction, "Transaction should be stored in repository");
    });

    test("throws InsufficientFundsException when balance is insufficient", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 50, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet, "user-123");
        await walletRepository.create(toWallet, "user-456");

        const transactionRepository = new MockTransactionRepository();
        const service = new TransactionProcessorService(transactionRepository, walletRepository);

        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100
        });

        // Execute & Verify
        assert.rejects(
            () => service.processByWalletId(paymentDTO, "user-123"),
            InsufficientFundsException,
            "Should throw InsufficientFundsException when balance is insufficient"
        );

        // Verify transaction was NOT created
        const storedTransactions = await transactionRepository.findById("any-id");
        assert.strictEqual(storedTransactions, null, "No transaction should be stored when payment fails");
    });

    test("transaction includes description from payment DTO", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet, "user-123");
        await walletRepository.create(toWallet, "user-456");

        const transactionRepository = new MockTransactionRepository();
        const service = new TransactionProcessorService(transactionRepository, walletRepository);

        const customDescription = "Payment for services rendered";
        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: customDescription
        });

        // Execute
        const transaction = await service.processByWalletId(paymentDTO, "user-123");

        // Verify
        const data = transaction.getData();
        assert.strictEqual(data.description, customDescription, "Transaction should include the provided description");
    });

    test("processes multiple payments sequentially", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet, "user-123");
        await walletRepository.create(toWallet, "user-456");

        const transactionRepository = new MockTransactionRepository();
        const service = new TransactionProcessorService(transactionRepository, walletRepository);

        // Execute - First payment
        const payment1 = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: "Payment 1"
        });
        const transaction1 = await service.processByWalletId(payment1, "user-123");

        // Execute - Second payment
        const payment2 = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 200,
            description: "Payment 2"
        });
        const transaction2 = await service.processByWalletId(payment2, "user-123");

        // Verify
        assert.notStrictEqual(transaction1.getId(), transaction2.getId(), "Each payment should create a unique transaction");

        const stored1 = await transactionRepository.findById(transaction1.getId());
        const stored2 = await transactionRepository.findById(transaction2.getId());

        assert.ok(stored1, "First transaction should be stored");
        assert.ok(stored2, "Second transaction should be stored");
    });
});
