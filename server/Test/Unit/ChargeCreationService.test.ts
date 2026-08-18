import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { ChargeCreationService } from '../../App/Service/ChargeCreationService.js';
import { MockWalletRepository } from '../../App/Repository/Wallet/MockWalletRepository.js';
import { MockChargeRepository } from '../../App/Repository/Charge/MockChargeRepository.js';
import { Wallet } from '../../App/Model/Wallet.js';
import { WalletNotFoundException } from '../../App/Exception/DomainException.js';

describe('ChargeCreationService', () => {
    test('creates a charge when issuer wallet exists', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();

        const userId = 'user-1';
        const wallet = new Wallet(userId, undefined, 0, 'wallet-1');
        await walletRepo.create(wallet);

        const service = new ChargeCreationService(chargeRepo, walletRepo);

        const payload = { amount: 123, description: 'Test charge' };

        const created = await service.create(payload, userId);

        assert.strictEqual(created.getIssuerWalletId(), wallet.getId());
        assert.strictEqual(created.getAmount(), 123);
        assert.strictEqual(created.getDescription(), 'Test charge');

        const stored = await chargeRepo.findById(created.getId());
        assert.ok(stored, 'Charge should be stored in repository');
        assert.strictEqual(stored!.getId(), created.getId());
    });

    test('throws WalletNotFoundException when issuer wallet is missing', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();

        const service = new ChargeCreationService(chargeRepo, walletRepo);

        const payload = { amount: 123, description: 'Test charge' };

        await assert.rejects(
            async () => { await service.create(payload, 'unknown-user'); },
            WalletNotFoundException
        );
    });
});
