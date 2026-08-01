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
        await repo.create(wallet, 'user-1');

        const service = new WalletManagementService(repo as any);

        const result = await service.getWalletData('wallet-1');

        assert.strictEqual(result, wallet);
    });

    test('getStatement throws WalletNotFoundException when wallet not found', async () => {
        const repo = new MockWalletRepository();

        const service = new WalletManagementService(repo as any);

        await assert.rejects(async () => {
            await service.getStatement('user-1', 1, 2026);
        }, (err: unknown) => {
            if (err instanceof WalletNotFoundException) return true;
            return false;
        });
    });

    test('getStatement returns entries and walletCreationDate when wallet exists', async () => {
        const repo = new MockWalletRepository();
        const creationDate = new Date('2026-01-10');
        const wallet = new Wallet('user-1', WalletStatus.ACTIVE, 0, 'wallet-123', creationDate);
        await repo.create(wallet, 'user-1');

        const tx1 = new Transaction(
            [
                new LedgerEntry(wallet.getId(), 'counterparty-1', LedgerEntryType.CREDIT, 100, undefined, undefined, 'le1', new Date('2026-01-11')),
                new LedgerEntry('counterparty-1', wallet.getId(), LedgerEntryType.DEBIT, 100, undefined, undefined, 'le2', new Date('2026-01-11'))
            ],
            'tx 1',
            null,
            't1',
            new Date('2026-01-11')
        );

        const tx2 = new Transaction(
            [
                new LedgerEntry(wallet.getId(), 'counterparty-2', LedgerEntryType.DEBIT, 50, undefined, undefined, 'le3', new Date('2026-01-12')),
                new LedgerEntry('counterparty-2', wallet.getId(), LedgerEntryType.CREDIT, 50, undefined, undefined, 'le4', new Date('2026-01-12'))
            ],
            'tx 2',
            null,
            't2',
            new Date('2026-01-12')
        );

        const entriesMock: Transaction[] = [tx1, tx2];

        // Register transactions on the mock repository
        repo.addEntries(wallet.getId(), entriesMock);

        const service = new WalletManagementService(repo as any);

        const result = await service.getStatement('user-1', 1, 2026);

        assert.deepStrictEqual(result.entries, entriesMock);
        assert.deepStrictEqual(result.walletCreationDate, creationDate);
    });
});
