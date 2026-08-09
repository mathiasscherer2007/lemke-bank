import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { Charge } from '../../App/Model/Charge.js';
import { ChargeStatus } from '../../App/Model/Enum/ChargeStatus.js';
import { ChargePaidOrExpiredException, TransactionAttachedToNotPaidCharge, ChargeAlreadyHasTransactionException } from '../../App/Exception/DomainException.js';

describe('Charge model', () => {
    test('constructor creates a charge with minimal parameters', () => {
        const issuerWalletId = 'wallet-456';
        const amount = 100;

        const charge = new Charge(issuerWalletId, amount);

        const primitives = charge.toPrimitives();
        assert.ok(primitives.id, 'Charge should have an auto-generated id');
        assert.strictEqual(primitives.issuerWalletId, issuerWalletId);
        assert.strictEqual(primitives.amount, amount);
        assert.strictEqual(primitives.status, ChargeStatus.OPEN, 'Default status should be OPEN');
        assert.strictEqual(primitives.description, undefined);
        assert.strictEqual(primitives.payerWalletId, undefined);
        assert.strictEqual(primitives.paymentTransactionId, undefined);
        assert.strictEqual(primitives.paidAt, undefined);
    });

    test('constructor creates a charge with custom id', () => {
        const issuerWalletId = 'wallet-456';
        const amount = 100;
        const customId = 'charge-123';

        const charge = new Charge(issuerWalletId, amount, undefined, customId);

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.id, customId);
    });

    test('constructor creates a charge with all parameters provided', () => {
        const issuerWalletId = 'wallet-456';
        const amount = 100;
        const description = 'Test charge';
        const customId = 'charge-123';
        const status = ChargeStatus.OPEN;
        const createdAt = new Date('2025-01-01T10:00:00Z');
        const expiresAt = new Date('2025-01-01T11:00:00Z');
        const payerWalletId = 'payer-789';
        const paymentTransactionId = 'txn-012';
        const paidAt = new Date('2025-01-01T10:30:00Z');

        const charge = new Charge(
            issuerWalletId,
            amount,
            description,
            customId,
            status,
            createdAt,
            expiresAt,
            payerWalletId,
            paymentTransactionId,
            paidAt
        );

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.id, customId);
        assert.strictEqual(primitives.issuerWalletId, issuerWalletId);
        assert.strictEqual(primitives.amount, amount);
        assert.strictEqual(primitives.description, description);
        assert.strictEqual(primitives.status, status);
        assert.strictEqual(primitives.createdAt, createdAt);
        assert.strictEqual(primitives.expiresAt, expiresAt);
        assert.strictEqual(primitives.payerWalletId, payerWalletId);
        assert.strictEqual(primitives.paymentTransactionId, paymentTransactionId);
        assert.strictEqual(primitives.paidAt, paidAt);
    });

    test('constructor sets expiration to 30 minutes from creation when not provided', () => {
        const issuerWalletId = 'wallet-456';
        const amount = 100;
        const beforeCreation = new Date();

        const charge = new Charge(issuerWalletId, amount);

        const afterCreation = new Date();
        const primitives = charge.toPrimitives();
        const expiresAt = primitives.expiresAt as Date;

        const expectedMinExpiration = new Date(beforeCreation.getTime() + 30 * 60 * 1000);
        const expectedMaxExpiration = new Date(afterCreation.getTime() + 30 * 60 * 1000);

        assert.ok(expiresAt >= expectedMinExpiration, 'Expiration should be at least 30 minutes from creation start');
        assert.ok(expiresAt <= expectedMaxExpiration, 'Expiration should be at most 30 minutes from creation end');
    });

    test('constructor accepts null description', () => {
        const charge = new Charge('wallet-456', 100, null);

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.description, null);
    });

    test('constructor accepts null expiresAt and calculates 30-minute expiration', () => {
        const charge = new Charge('wallet-456', 100, undefined, undefined, ChargeStatus.OPEN, undefined, null);

        const primitives = charge.toPrimitives();
        assert.ok(primitives.expiresAt instanceof Date, 'Expiration should be a Date object');
    });

    test('pay throws exception when charge is already paid', () => {
        const charge = new Charge('wallet-456', 100, undefined, 'charge-123', ChargeStatus.PAID);

        assert.throws(
            () => charge.pay('payer-789'),
            ChargePaidOrExpiredException,
            'pay() should throw ChargePaidOrExpiredException when charge is already PAID'
        );
    });

    test('pay throws exception when charge is expired', () => {
        const expiredDate = new Date();
        expiredDate.setMinutes(expiredDate.getMinutes() - 10);

        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.OPEN,
            undefined,
            expiredDate
        );

        assert.throws(
            () => charge.pay('payer-789'),
            ChargePaidOrExpiredException,
            'pay() should throw ChargePaidOrExpiredException when charge is expired'
        );
    });

    test('pay sets payerWalletId and status to PAID when charge is open and not expired', () => {
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 30);

        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.OPEN,
            undefined,
            futureDate
        );

        const payerWalletId = 'payer-789';
        const beforePay = new Date();
        charge.pay(payerWalletId);
        const afterPay = new Date();

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.payerWalletId, payerWalletId, 'Payer wallet ID should be set');
        assert.strictEqual(primitives.status, ChargeStatus.PAID, 'Status should be PAID');
        
        const paidAt = primitives.paidAt as Date;
        assert.ok(paidAt >= beforePay, 'paidAt should be after or at the time of pay() call');
        assert.ok(paidAt <= afterPay, 'paidAt should be before or at the time after pay() call');
    });

    test('pay throws exception when charge has EXPIRED status', () => {
        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.EXPIRED
        );

        assert.throws(
            () => charge.pay('payer-789'),
            ChargePaidOrExpiredException,
            'pay() should throw ChargePaidOrExpiredException when charge has EXPIRED status'
        );
    });

    test('attachTransaction throws exception when charge is not paid', () => {
        const charge = new Charge('wallet-456', 100, undefined, 'charge-123', ChargeStatus.OPEN);

        assert.throws(
            () => charge.attachTransaction('txn-012'),
            TransactionAttachedToNotPaidCharge,
            'attachTransaction() should throw TransactionAttachedToNotPaidCharge when status is not PAID'
        );
    });

    test('attachTransaction throws exception when charge already has a payment transaction', () => {
        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.PAID,
            undefined,
            undefined,
            undefined,
            'existing-txn-123'
        );

        assert.throws(
            () => charge.attachTransaction('txn-012'),
            ChargeAlreadyHasTransactionException,
            'attachTransaction() should throw ChargeAlreadyHasTransactionException when charge already has a transaction'
        );
    });

    test('attachTransaction sets paymentTransactionId when charge is paid and has no transaction', () => {
        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.PAID
        );

        const paymentTransactionId = 'txn-012';
        charge.attachTransaction(paymentTransactionId);

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.paymentTransactionId, paymentTransactionId, 'Payment transaction ID should be set');
    });

    test('isExpired returns true when charge expiration date has passed', () => {
        const expiredDate = new Date();
        expiredDate.setMinutes(expiredDate.getMinutes() - 10);

        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.OPEN,
            undefined,
            expiredDate
        );

        const result = charge.isExpired();
        assert.strictEqual(result, true, 'isExpired() should return true when charge is expired');

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.status, ChargeStatus.EXPIRED, 'Status should be updated to EXPIRED');
    });

    test('isExpired returns false when charge expiration date has not passed', () => {
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 30);

        const charge = new Charge(
            'wallet-456',
            100,
            undefined,
            'charge-123',
            ChargeStatus.OPEN,
            undefined,
            futureDate
        );

        const result = charge.isExpired();
        assert.strictEqual(result, false, 'isExpired() should return false when charge is not expired');

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.status, ChargeStatus.OPEN, 'Status should remain OPEN');
    });

    test('toPrimitives returns an object with all charge properties', () => {
        const issuerWalletId = 'wallet-456';
        const amount = 100;
        const description = 'Test charge';

        const charge = new Charge(issuerWalletId, amount, description);
        const primitives = charge.toPrimitives();

        assert.ok(typeof primitives === 'object', 'toPrimitives should return an object');
        assert.ok('id' in primitives, 'Primitives should contain id property');
        assert.ok('issuerWalletId' in primitives, 'Primitives should contain issuerWalletId property');
        assert.ok('amount' in primitives, 'Primitives should contain amount property');
        assert.ok('description' in primitives, 'Primitives should contain description property');
        assert.ok('status' in primitives, 'Primitives should contain status property');
        assert.ok('expiresAt' in primitives, 'Primitives should contain expiresAt property');
        assert.ok('createdAt' in primitives, 'Primitives should contain createdAt property');
        assert.ok('payerWalletId' in primitives, 'Primitives should contain payerWalletId property');
        assert.ok('paymentTransactionId' in primitives, 'Primitives should contain paymentTransactionId property');
        assert.ok('paidAt' in primitives, 'Primitives should contain paidAt property');
    });

    test('charge with different statuses initializes correctly', () => {
        const openCharge = new Charge('wallet-456', 100, undefined, 'charge-1', ChargeStatus.OPEN);
        const paidCharge = new Charge('wallet-456', 100, undefined, 'charge-2', ChargeStatus.PAID);
        const expiredCharge = new Charge('wallet-456', 100, undefined, 'charge-3', ChargeStatus.EXPIRED);

        assert.strictEqual(openCharge.toPrimitives().status, ChargeStatus.OPEN);
        assert.strictEqual(paidCharge.toPrimitives().status, ChargeStatus.PAID);
        assert.strictEqual(expiredCharge.toPrimitives().status, ChargeStatus.EXPIRED);
    });

    test('charge preserves createdAt timestamp when provided', () => {
        const createdAt = new Date('2025-01-01T10:00:00Z');
        const charge = new Charge('wallet-456', 100, undefined, undefined, undefined, createdAt);

        const primitives = charge.toPrimitives();
        assert.strictEqual(primitives.createdAt, createdAt, 'createdAt should be preserved');
    });
});
