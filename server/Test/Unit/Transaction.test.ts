import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { Transaction } from '../../App/Model/Transaction';
import { LedgerEntry } from '../../App/Model/LedgerEntry';

describe('Transaction model', () => {
    test('creates a balanced transaction and generates transaction metadata', () => {
        const entries = [
            new LedgerEntry('debit', 120, 'wallet-debit'),
            new LedgerEntry('credit', 120, 'wallet-credit')
        ];

        const transaction = new Transaction(entries, 'Test payment', 'charge-123');
        const anyTransaction = transaction as unknown as Record<string, unknown>;

        assert.strictEqual(anyTransaction.amount, 120, 'Transaction amount should match the balanced total');
        assert.strictEqual(anyTransaction.fromWalletId, 'wallet-debit', 'Transaction should set the debit wallet as the fromWalletId');
        assert.strictEqual(anyTransaction.toWalletId, 'wallet-credit', 'Transaction should set the credit wallet as the toWalletId');
        assert.ok(typeof anyTransaction.id === 'string' && (anyTransaction.id as string).length > 0, 'Transaction should generate an id');
        assert.ok(anyTransaction.createdAt instanceof Date, 'Transaction should generate a creation timestamp');
        assert.strictEqual(anyTransaction.description, 'Test payment', 'Transaction should keep the provided description');
        assert.strictEqual(anyTransaction.chargeId, 'charge-123', 'Transaction should keep the provided chargeId');
    });

    test('throws when a transaction is missing either credit or debit entry', () => {
        const onlyDebit = [new LedgerEntry('debit', 100, 'wallet-debit')];
        const onlyCredit = [new LedgerEntry('credit', 100, 'wallet-credit')];

        assert.throws(
            () => new Transaction(onlyDebit),
            /Transaction must have at least one credit and one debit entry\./,
            'Transaction without a credit entry should throw an error'
        );

        assert.throws(
            () => new Transaction(onlyCredit),
            /Transaction must have at least one credit and one debit entry\./,
            'Transaction without a debit entry should throw an error'
        );
    });

    test('throws when debit and credit totals are unbalanced', () => {
        const entries = [
            new LedgerEntry('debit', 150, 'wallet-debit'),
            new LedgerEntry('credit', 100, 'wallet-credit')
        ];

        assert.throws(
            () => new Transaction(entries),
            /Transaction is not balanced: total credit does not equal total debit\./,
            'Transaction with unequal debit and credit totals should throw an error'
        );
    });
});
