import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { Transaction } from '../../App/Model/Transaction';
import { LedgerEntry } from '../../App/Model/LedgerEntry';
import { MissingTransactionLedgerEntryTypeException, UnbalancedTransactionException } from '../../App/Exception/DomainException';
import { LedgerEntryType } from '../../App/Model/Enum/LedgerEntryType';

describe('Transaction model', () => {
    test('creates a balanced transaction and generates transaction metadata', () => {
        const entries = [
            new LedgerEntry('wallet-debit-uuid', 'wallet-credit-uuid', LedgerEntryType.DEBIT, 100, 200),
            new LedgerEntry('wallet-credit-uuid', 'wallet-debit-uuid', LedgerEntryType.CREDIT, 100, 100)
        ];

        const transaction = new Transaction(entries, undefined, 'Test payment', 'charge-123');
        const data = transaction.getData();

        assert.strictEqual(data.amount, 100, 'Transaction amount should match the balanced total');
        assert.strictEqual(data.fromWalletId, 'wallet-debit-uuid', 'Transaction should set the debit wallet as the fromWalletId');
        assert.strictEqual(data.toWalletId, 'wallet-credit-uuid', 'Transaction should set the credit wallet as the toWalletId');
        assert.strictEqual(data.id, undefined, 'Transaction id should be undefined when not provided');
        assert.strictEqual(data.createdAt, undefined, 'Transaction createdAt should be undefined when not provided');
        assert.strictEqual(data.description, 'Test payment', 'Transaction should keep the provided description');
        assert.strictEqual(data.chargeId, 'charge-123', 'Transaction should keep the provided chargeId');
    });

    test('throws when a transaction is missing either credit or debit entry', () => {
        const onlyDebit = [new LedgerEntry('wallet-debit-uuid', 'wallet-credit-uuid', LedgerEntryType.DEBIT, 100, 200)];
        const onlyCredit = [new LedgerEntry('wallet-credit-uuid', 'wallet-debit-uuid', LedgerEntryType.CREDIT, 100, 100)];

        assert.throws(
            () => new Transaction(onlyDebit),
            new MissingTransactionLedgerEntryTypeException(LedgerEntryType.CREDIT),
            'Transaction without a credit entry should throw an error'
        );

        assert.throws(
            () => new Transaction(onlyCredit),
            new MissingTransactionLedgerEntryTypeException(LedgerEntryType.DEBIT),
            'Transaction without a debit entry should throw an error'
        );
    });

    test('throws when debit and credit totals are unbalanced', () => {
        const entries = [
            new LedgerEntry('wallet-debit-uuid', 'wallet-credit-uuid', LedgerEntryType.DEBIT, 150, 200),
            new LedgerEntry('wallet-credit-uuid', 'wallet-debit-uuid', LedgerEntryType.CREDIT, 100, 100)
        ];

        assert.throws(
            () => new Transaction(entries),
            new UnbalancedTransactionException(),
            'Transaction with unequal debit and credit totals should throw an error'
        );
    });
});
