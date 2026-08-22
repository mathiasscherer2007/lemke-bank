import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { WalletManagementService } from '../../App/Service/WalletManagementService.js';
import { MockWalletRepository } from '../../App/Repository/Wallet/MockWalletRepository.js';
import { Wallet } from '../../App/Model/Wallet.js';
import { WalletStatus } from '../../App/Model/Enum/WalletStatus.js';
import { MockStatementRepository } from '../../App/Repository/Statement/MockStatementRepository.js';
import { MockUserRepository } from '../../App/Repository/User/MockUserRepository.js';
import { UserRole } from '../../App/Model/Enum/UserRole.js';
import { User } from '../../App/Model/User.js';
import { StatementTransaction } from '../../App/Model/StatementTransaction.js';

describe('WalletManagementService', () => {
    test('getWalletData returns repository.findById result', async () => {

        const walletRepository = new MockWalletRepository();
        const statementRepository = new MockStatementRepository();
        const userRepository = new MockUserRepository();

        const user = new User('test@example.com', 'hashed-password', 'testuser', UserRole.USER, 'user-1');
        const wallet = new Wallet('user-1', WalletStatus.ACTIVE, 0, 'wallet-1', new Date('2026-01-01'));

        await userRepository.save(user);
        await walletRepository.create(wallet);

        const service = new WalletManagementService(walletRepository as any, userRepository as any, statementRepository as any);

        const { user: resultUser, wallet: resultWallet } = await service.getWalletData('wallet-1');
        const resultUserData = resultUser.toPrimitives() as any;
        delete resultUserData.passwordHash; // Remove passwordHash for comparison

        const userData = user.toPrimitives() as any;
        delete userData.passwordHash; // Remove passwordHash for comparison

        assert.deepStrictEqual({ ...resultWallet, user: resultUserData }, { ...wallet, user: userData });
    });

    test('getOverview returns the wallet and its ten most recent transactions', async () => {
        const walletRepository = new MockWalletRepository();
        const statementRepository = new MockStatementRepository();
        const userRepository = new MockUserRepository();

        const wallet = new Wallet('user-1', WalletStatus.ACTIVE, 0, 'wallet-1', new Date('2026-01-01'));
        await walletRepository.create(wallet);

        const transactions = Array.from({ length: 11 }, (_, index) => new StatementTransaction(
            `transaction-${index + 1}`,
            100,
            `Transaction ${index + 1}`,
            [],
            new Date(2026, 0, index + 1),
        ));

        for (const transaction of transactions) {
            statementRepository.addTransaction(wallet.getId(), transaction);
        }

        const service = new WalletManagementService(walletRepository as any, userRepository as any, statementRepository as any);

        const result = await service.getOverview(wallet.getUserId());

        assert.strictEqual(result.wallet, wallet);
        assert.deepStrictEqual(
            result.recentTransactions,
            transactions.slice().reverse().slice(0, 10),
        );
    });

    
});
