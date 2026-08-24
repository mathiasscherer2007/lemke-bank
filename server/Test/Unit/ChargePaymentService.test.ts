import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { ChargePaymentService } from '../../App/Service/ChargePaymentService.js';
import { MockWalletRepository } from '../../App/Repository/Wallet/MockWalletRepository.js';
import { MockChargeRepository } from '../../App/Repository/Charge/MockChargeRepository.js';
import { MockUserRepository } from '../../App/Repository/User/MockUserRepository.js';
import { Wallet } from '../../App/Model/Wallet.js';
import { Charge } from '../../App/Model/Charge.js';
import { LedgerEntry } from '../../App/Model/LedgerEntry.js';
import { LedgerEntryType } from '../../App/Model/Enum/LedgerEntryType.js';
import { Transaction } from '../../App/Model/Transaction.js';
import { User } from '../../App/Model/User.js';
import { UserRole } from '../../App/Model/Enum/UserRole.js';
import {
    ChargeNotFoundException,
    WalletNotFoundException,
    ChargePaidOrExpiredException,
    UserNotFoundException,
} from '../../App/Exception/DomainException.js';
import { PaymentByWalletIdDTO } from '../../App/Dto/Request.js';

class FakeTransactionProcessorService {
    public readonly calls: Array<{ payload: PaymentByWalletIdDTO; userId: string }> = [];

    async process(payload: PaymentByWalletIdDTO, userId: string): Promise<Transaction> {
        this.calls.push({ payload, userId });

        const debit = new LedgerEntry(userId, payload.toWalletId, LedgerEntryType.DEBIT, payload.amount);
        const credit = new LedgerEntry(payload.toWalletId, userId, LedgerEntryType.CREDIT, payload.amount, 0);
        return new Transaction([debit, credit], payload.description);
    }
}

const createService = (
    userRepository = new MockUserRepository(),
    chargeRepository = new MockChargeRepository(),
    walletRepository = new MockWalletRepository(),
    transactionProcessor = new FakeTransactionProcessorService(),
) => ({
    service: new ChargePaymentService(
        userRepository,
        chargeRepository,
        walletRepository,
        transactionProcessor as any,
    ),
    userRepository,
    chargeRepository,
    walletRepository,
    transactionProcessor,
});

const createUser = (id: string): User => new User(
    `${id}@example.com`,
    'password-hash',
    id,
    UserRole.USER,
    id,
);

describe('ChargePaymentService', () => {
    test('getData returns the charge, issuer, and issuer-wallet flag', async () => {
        const { service, userRepository, chargeRepository, walletRepository } = createService();
        const viewerUserId = 'viewer-user';
        const issuerWallet = new Wallet('issuer-user', undefined, 0, 'wallet-issuer');
        const viewerWallet = new Wallet(viewerUserId, undefined, 0, 'wallet-viewer');
        const issuer = createUser(issuerWallet.getId());

        await walletRepository.create(viewerWallet);
        await userRepository.save(issuer);
        chargeRepository.seed(new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1'));

        const result = await service.getData('charge-1', viewerUserId);

        assert.strictEqual(result.charge.getId(), 'charge-1');
        assert.strictEqual(result.issuer, issuer);
        assert.strictEqual(result.isIssuerWallet, false);
    });

    test('getData marks the current wallet as the issuer wallet', async () => {
        const { service, userRepository, chargeRepository, walletRepository } = createService();
        const issuerWallet = new Wallet('issuer-user', undefined, 0, 'wallet-issuer');
        const issuer = createUser(issuerWallet.getId());

        await walletRepository.create(issuerWallet);
        await userRepository.save(issuer);
        chargeRepository.seed(new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1'));

        const result = await service.getData('charge-1', 'issuer-user');

        assert.strictEqual(result.issuer, issuer);
        assert.strictEqual(result.isIssuerWallet, true);
    });

    test('getData throws when charge not found', async () => {
        const { service } = createService();

        await assert.rejects(
            service.getData('missing', 'user-1'),
            ChargeNotFoundException,
        );
    });

    test('getData throws when current user has no wallet', async () => {
        const { service, chargeRepository } = createService();
        chargeRepository.seed(new Charge('wallet-issuer', 50, 'desc', 'charge-1'));

        await assert.rejects(
            service.getData('charge-1', 'unknown-user'),
            WalletNotFoundException,
        );
    });

    test('getData throws when the issuer user is not found', async () => {
        const { service, chargeRepository, walletRepository } = createService();
        await walletRepository.create(new Wallet('viewer-user', undefined, 0, 'wallet-viewer'));
        chargeRepository.seed(new Charge('wallet-issuer', 50, 'desc', 'charge-1'));

        await assert.rejects(
            service.getData('charge-1', 'viewer-user'),
            UserNotFoundException,
        );
    });

    test('makePaymentTransaction throws when charge not found', async () => {
        const { service } = createService();

        await assert.rejects(
            service.makePaymentTransaction('missing', 'user-1'),
            ChargeNotFoundException,
        );
    });

    test('makePaymentTransaction throws when payer wallet is not found', async () => {
        const { service, chargeRepository } = createService();
        chargeRepository.seed(new Charge('wallet-issuer', 50, 'desc', 'charge-1'));

        await assert.rejects(
            service.makePaymentTransaction('charge-1', 'missing-user'),
            WalletNotFoundException,
        );
    });

    test('makePaymentTransaction throws when charge is expired', async () => {
        const { service, chargeRepository, walletRepository } = createService();
        const payerUserId = 'payer-user';
        const payerWallet = new Wallet(payerUserId, undefined, 100, 'wallet-payer');
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() - 10);

        await walletRepository.create(payerWallet);
        chargeRepository.seed(new Charge(
            'wallet-issuer',
            50,
            'desc',
            'charge-1',
            undefined,
            undefined,
            expired,
        ));

        await assert.rejects(
            service.makePaymentTransaction('charge-1', payerUserId),
            ChargePaidOrExpiredException,
        );
    });

    test('makePaymentTransaction processes payment and attaches the transaction', async () => {
        const { service, chargeRepository, walletRepository, transactionProcessor } = createService();
        const issuerWallet = new Wallet('issuer-user', undefined, 0, 'wallet-issuer');
        const payerUserId = 'payer-user';
        const payerWallet = new Wallet(payerUserId, undefined, 1000, 'wallet-payer');
        const charge = new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1');

        await walletRepository.create(issuerWallet);
        await walletRepository.create(payerWallet);
        chargeRepository.seed(charge);

        const transaction = await service.makePaymentTransaction('charge-1', payerUserId);

        assert.deepStrictEqual(transactionProcessor.calls, [{
            payload: {
                toWalletId: issuerWallet.getId(),
                amount: 50,
                description: 'desc',
            },
            userId: payerUserId,
        }]);

        const updated = await chargeRepository.findById('charge-1');
        assert.ok(updated);
        const primitives = updated.toPrimitives();
        assert.strictEqual(primitives.paymentTransactionId, transaction.getId());
        assert.strictEqual(primitives.payerWalletId, payerWallet.getId());
        assert.strictEqual(primitives.status, 'paid');
    });
});
