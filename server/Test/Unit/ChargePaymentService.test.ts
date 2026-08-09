import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { ChargePaymentService } from '../../App/Service/ChargePaymentService.js';
import { MockWalletRepository } from '../../App/Repository/Wallet/MockWalletRepository.js';
import { MockChargeRepository } from '../../App/Repository/Charge/MockChargeRepository.js';
import { Wallet } from '../../App/Model/Wallet.js';
import { Charge } from '../../App/Model/Charge.js';
import { LedgerEntry } from '../../App/Model/LedgerEntry.js';
import { LedgerEntryType } from '../../App/Model/Enum/LedgerEntryType.js';
import { Transaction } from '../../App/Model/Transaction.js';
import { ChargeNotFoundException, WalletNotFoundException, ChargePaidOrExpiredException } from '../../App/Exception/DomainException.js';

class FakeTransactionProcessorService {
    async process(payload: any, userId: string): Promise<Transaction> {
        // create a balanced transaction as a result
        const debit = new LedgerEntry(userId, payload.toWalletId, LedgerEntryType.DEBIT, payload.amount);
        const credit = new LedgerEntry(payload.toWalletId, userId, LedgerEntryType.CREDIT, payload.amount, 0);
        const tx = new Transaction([debit, credit], payload.description);
        return tx;
    }
}

describe('ChargePaymentService', () => {
    test('getData returns charge and isIssuerWallet flag', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();

        const userId = 'user-1';
        const issuerWallet = new Wallet(userId, undefined, 0, 'wallet-1');
        await walletRepo.create(issuerWallet, userId);

        const charge = new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1');
        chargeRepo.seed(charge);

        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        const result = await svc.getData('charge-1', userId);
        assert.strictEqual(result.charge.getId(), 'charge-1');
        assert.strictEqual(result.isIssuerWallet, true);
    });

    test('getData throws when charge not found', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();
        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        await assert.rejects(async () => { await svc.getData('missing', 'user-1'); }, ChargeNotFoundException);
    });

    test('getData throws when wallet not found', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();
        const charge = new Charge('wallet-x', 50, 'desc', 'charge-1');
        chargeRepo.seed(charge);

        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        await assert.rejects(async () => { await svc.getData('charge-1', 'unknown-user'); }, WalletNotFoundException);
    });

    test('makePaymentTransaction throws when charge not found', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();
        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        await assert.rejects(async () => { await svc.makePaymentTransaction('missing', 'user-1'); }, ChargeNotFoundException);
    });

    test('makePaymentTransaction throws when payer wallet not found', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();
        const charge = new Charge('wallet-issuer', 50, 'desc', 'charge-1');
        chargeRepo.seed(charge);

        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        await assert.rejects(async () => { await svc.makePaymentTransaction('charge-1', 'missing-user'); }, WalletNotFoundException);
    });

    test('makePaymentTransaction throws when charge is expired', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();

        const issuerUser = 'issuer';
        const issuerWallet = new Wallet(issuerUser, undefined, 0, 'wallet-issuer');
        await walletRepo.create(issuerWallet, issuerUser);

        // create expired charge
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() - 10);
        const charge = new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1', undefined, undefined, expired);
        chargeRepo.seed(charge);

        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        await assert.rejects(async () => { await svc.makePaymentTransaction('charge-1', issuerUser); }, ChargePaidOrExpiredException);
    });

    test('makePaymentTransaction processes payment and attaches transaction', async () => {
        const walletRepo = new MockWalletRepository();
        const chargeRepo = new MockChargeRepository();

        const issuerUser = 'issuer';
        const payerUser = 'payer';
        const issuerWallet = new Wallet(issuerUser, undefined, 0, 'wallet-issuer');
        const payerWallet = new Wallet(payerUser, undefined, 1000, 'wallet-payer');
        await walletRepo.create(issuerWallet, issuerUser);
        await walletRepo.create(payerWallet, payerUser);

        const charge = new Charge(issuerWallet.getId(), 50, 'desc', 'charge-1');
        chargeRepo.seed(charge);

        const svc = new ChargePaymentService(chargeRepo, walletRepo, new FakeTransactionProcessorService() as any);

        const tx = await svc.makePaymentTransaction('charge-1', payerUser);

        // verify transaction and that charge was updated in repo
        const updated = await chargeRepo.findById('charge-1');
        assert.ok(updated, 'Updated charge should exist');
        const prims = updated!.toPrimitives();
        assert.strictEqual(prims.paymentTransactionId, tx.getId());
        assert.strictEqual(prims.payerWalletId, payerWallet.getId());
        assert.strictEqual(prims.status, 'paid');
    });
});
