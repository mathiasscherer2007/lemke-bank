import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { Wallet } from '../../App/Model/Wallet.js';
import { WalletStatus } from '../../App/Model/Enum/WalletStatus.js';

describe('Wallet model', () => {
    test('hasEnoughBalance returns true when balance is sufficient', () => {
        const wallet = new Wallet('user-456', WalletStatus.ACTIVE, 250, 'wallet-123', new Date(), new Date());

        const result = wallet.hasEnoughBalance(200);

        assert.strictEqual(result, true, 'Wallet should have enough balance when the amount is less than the current balance');
    });

    test('hasEnoughBalance returns false when balance is insufficient', () => {
        const wallet = new Wallet('user-456', WalletStatus.ACTIVE, 150, 'wallet-123', new Date(), new Date());

        const result = wallet.hasEnoughBalance(200);

        assert.strictEqual(result, false, 'Wallet should not have enough balance when the amount exceeds the current balance');
    });
});
