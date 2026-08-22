import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { WalletManagementService } from '../../App/Service/WalletManagementService.js';
import { WalletNotFoundException } from '../../App/Exception/DomainException.js';
import { MockWalletRepository } from '../../App/Repository/Wallet/MockWalletRepository.js';
import { Wallet } from '../../App/Model/Wallet.js';
import { WalletStatus } from '../../App/Model/Enum/WalletStatus.js';
import { LedgerEntry } from '../../App/Model/LedgerEntry.js';
import { LedgerEntryType } from '../../App/Model/Enum/LedgerEntryType.js';
import { Transaction } from '../../App/Model/Transaction.js';

describe('WalletManagementService', () => {
    test('getWalletData returns repository.findById result', async () => {
        const repo = new MockWalletRepository();
        const wallet = new Wallet('user-1', WalletStatus.ACTIVE, 0, 'wallet-1', new Date('2026-01-01'));
        await repo.create(wallet);

        const service = new WalletManagementService(repo as any);

        const result = await service.getWalletData('wallet-1');

        assert.strictEqual(result, wallet);
    });

    
});
