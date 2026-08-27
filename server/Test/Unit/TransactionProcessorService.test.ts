import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { MockTransactionRepository } from "../../App/Repository/Transaction/MockTransactionRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";
import { LedgerEntryType } from "../../App/Model/Enum/LedgerEntryType.js";
import { PaymentByWalletIdDTO, BatchPaymentDTO } from "../../App/Dto/Request.js";
import { InsufficientFundsException, NotABusinessDayException, TransactionOriginEqualsDestinationException } from "../../App/Exception/DomainException.js";
import { BusinessDayService } from "../../App/Service/WebService/BusinessDay/BusinessDayService.js";

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

const createBatchPaymentDTO = (
    overrides?: Partial<BatchPaymentDTO>
): BatchPaymentDTO => {
    return {
        walletIds: [
            "wallet-credit-1",
            "wallet-credit-2",
            "wallet-credit-3"
        ],
        amount: 100,
        description: "Batch test",
        ...overrides
    };
};

class MockBusinessDayService implements BusinessDayService {
    private isBusinessDayValue: boolean = true;

    setIsBusinessDay(value: boolean): void {
        this.isBusinessDayValue = value;
    }

    async isBusinessDay(date: Date): Promise<boolean> {
        return this.isBusinessDayValue;
    }
}

describe("TransactionProcessorService", () => {
    test("successfully processes payment with sufficient balance", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet);
        await walletRepository.create(toWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();

        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: "Test payment"
        });

        // Execute
        const transaction = await transactionProcessorService.process(paymentDTO, "user-123");

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
        await walletRepository.create(fromWallet);
        await walletRepository.create(toWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();
        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100
        });

        // Execute & Verify
        await assert.rejects(
            () => transactionProcessorService.process(paymentDTO, "user-123"),
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
        await walletRepository.create(fromWallet);
        await walletRepository.create(toWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();
        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        const customDescription = "Payment for services rendered";
        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: customDescription
        });

        // Execute
        const transaction = await transactionProcessorService.process(paymentDTO, "user-123");

        // Verify
        const data = transaction.toPrimitives();
        assert.strictEqual(data.description, customDescription, "Transaction should include the provided description");
    });

    test("processes multiple payments sequentially", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet);
        await walletRepository.create(toWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();
        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        // Execute - First payment
        const payment1 = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100,
            description: "Payment 1"
        });
        const transaction1 = await transactionProcessorService.process(payment1, "user-123");

        // Execute - Second payment
        const payment2 = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 200,
            description: "Payment 2"
        });
        const transaction2 = await transactionProcessorService.process(payment2, "user-123");

        // Verify
        assert.notStrictEqual(transaction1.getId(), transaction2.getId(), "Each payment should create a unique transaction");

        const stored1 = await transactionRepository.findById(transaction1.getId());
        const stored2 = await transactionRepository.findById(transaction2.getId());

        assert.ok(stored1, "First transaction should be stored");
        assert.ok(stored2, "Second transaction should be stored");
    });

    test("throws NotABusinessDayException when date is not a business day", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");
        const toWallet = createTestWallet("user-456", 0, "wallet-to-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet);
        await walletRepository.create(toWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();
        businessDayService.setIsBusinessDay(false);
        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        const paymentDTO = createPaymentDTO({
            toWalletId: toWallet.getId(),
            amount: 100
        });

        // Execute & Verify
        await assert.rejects(
            () => transactionProcessorService.process(paymentDTO, "user-123"),
            NotABusinessDayException,
            "Should throw NotABusinessDayException when date is not a business day"
        );
    });

    test("successfully processes batch payment", async () => {
        // Setup
        const adminWallet = createTestWallet(
            "admin-123",
            1000,
            "wallet-admin-uuid"
        );

        const walletA = createTestWallet(
            "user-a",
            0,
            "wallet-a-uuid"
        );

        const walletB = createTestWallet(
            "user-b",
            0,
            "wallet-b-uuid"
        );

        const walletC = createTestWallet(
            "user-c",
            0,
            "wallet-c-uuid"
        );

        const walletRepository = new MockWalletRepository();

        await walletRepository.create(adminWallet);
        await walletRepository.create(walletA);
        await walletRepository.create(walletB);
        await walletRepository.create(walletC);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();

        const transactionProcessorService =
            new TransactionProcessorService(
                transactionRepository,
                walletRepository,
                businessDayService
            );

        const paymentDTO = createBatchPaymentDTO({
            walletIds: [
                walletA.getId(),
                walletB.getId(),
                walletC.getId()
            ],
            amount: 100
        });

        // Execute
        const transaction =
            await transactionProcessorService.processBatch(
                paymentDTO,
                "admin-123"
            );

        // Verify transaction
        assert.ok(transaction, "Should return a transaction");

        const entries = transaction.getEntries();

        assert.strictEqual(
            entries.length,
            6,
            "Transaction should have an equal amount of DEBIT and CREDIT entries."
        );

        // Find entries
        const debitEntries = entries.filter(
            entry => entry.getType() === LedgerEntryType.DEBIT
        );

        const creditEntries = entries.filter(
            entry => entry.getType() === LedgerEntryType.CREDIT
        );

        assert.strictEqual(
            debitEntries.length,
            3,
            "Should have exactly three DEBIT entries"
        );

        assert.strictEqual(
            creditEntries.length,
            3,
            "Should have exactly three CREDIT entries"
        );

        // Verify debit
        const debitEntry = debitEntries[0];

        assert.strictEqual(
            debitEntry.getWalletId(),
            adminWallet.getId(),
            "DEBIT should come from admin wallet"
        );

        const totalDebit = debitEntries.reduce((acc, entry) => {return acc + entry.getAmount()}, 0)

        assert.strictEqual(
            totalDebit,
            300,
            "DEBIT should be amount multiplied by number of wallets"
        );

        // Verify credits
        const creditedWalletIds = creditEntries.map(
            entry => entry.getWalletId()
        );

        assert.ok(
            creditedWalletIds.includes(walletA.getId()),
            "Wallet A should receive a CREDIT"
        );

        assert.ok(
            creditedWalletIds.includes(walletB.getId()),
            "Wallet B should receive a CREDIT"
        );

        assert.ok(
            creditedWalletIds.includes(walletC.getId()),
            "Wallet C should receive a CREDIT"
        );

        // Every wallet should receive exactly 100
        for (const entry of creditEntries) {
            assert.strictEqual(
                entry.getAmount(),
                100,
                "Each wallet should receive the requested amount"
            );
        }

        // Verify transaction is stored
        const storedTransaction =
            await transactionRepository.findById(transaction.getId());

        assert.strictEqual(
            storedTransaction,
            transaction,
            "Batch transaction should be stored in repository"
        );
    });
    test("throws TransactionOriginEqualsDestinationException when origin and destination wallets are the same", async () => {
        // Setup
        const fromWallet = createTestWallet("user-123", 500, "wallet-from-uuid");

        const walletRepository = new MockWalletRepository();
        await walletRepository.create(fromWallet);

        const transactionRepository = new MockTransactionRepository();
        const businessDayService = new MockBusinessDayService();
        businessDayService.setIsBusinessDay(true);
        const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository, businessDayService);

        const paymentDTO = createPaymentDTO({
            toWalletId: fromWallet.getId(),
            amount: 100
        });

        // Execute & Verify
        await assert.rejects(
            () => transactionProcessorService.process(paymentDTO, "user-123"),
            TransactionOriginEqualsDestinationException,
            "Should throw TransactionOriginEqualsDestinationException when origin and destination wallets are the same"
        );
    });
});
