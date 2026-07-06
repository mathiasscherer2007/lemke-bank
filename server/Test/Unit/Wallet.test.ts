import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { Wallet } from '../../App/Model/Wallet';

describe('Wallet model', () => {
    test('haveEnoughBalance returns true when balance is sufficient', () => {
        const wallet = new Wallet('wallet-123', 'user-456', 250, 'active', new Date(), new Date());

        const result = wallet.haveEnoughBalance(200);

        assert.strictEqual(result, true, 'Wallet should have enough balance when the amount is less than the current balance');
    });

    test('haveEnoughBalance returns false when balance is insufficient', () => {
        const wallet = new Wallet('wallet-123', 'user-456', 150, 'active', new Date(), new Date());

        const result = wallet.haveEnoughBalance(200);

        assert.strictEqual(result, false, 'Wallet should not have enough balance when the amount exceeds the current balance');
    });
});
