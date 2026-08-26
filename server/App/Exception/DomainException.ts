abstract class DomainException extends Error 
{
    public statusCode: number;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class UnbalancedTransactionException extends DomainException
{
    constructor() {
        super('Transaction is not balanced: total credit does not equal total debit.', 422, 'UNBALANCED_TRANSACTION');
    }
}

export class MissingTransactionLedgerEntryTypeException extends DomainException
{
    private readonly missingType: 'credit' | 'debit';

    constructor(missingType: 'credit' | 'debit') {
        super('Transaction must have at least one credit and one debit entry.', 422, 'MISSING_LEDGER_TYPE');
        this.missingType = missingType;
        this.message = `Transaction is missing a ${this.missingType} entry.`;
    }
}

export class TransactionNotFoundException extends DomainException
{
    private readonly missingId: string;

    constructor(missingId: string){
        super('Transaction not found.', 404, 'TRANSACTION_NOT_FOUND');
        this.missingId = missingId;
    }
}

export class TransactionOriginEqualsDestinationException extends DomainException
{
    private readonly walletId: string;

    constructor(walletId: string){
        super('Transaction origin is equal to destination.', 422, 'SAME_WALLETS');
        this.walletId = walletId;
    }
}

export class InsufficientFundsException extends DomainException
{
    constructor(){
        super('Insufficient funds to complete this transaction.', 422, 'INSUFFICIENT_FUNDS');
    }
}

export class WalletNotFoundException extends DomainException
{
    private readonly missingWalletId?: string;
    private readonly missingUserId?: string;

    constructor(missingWalletId?: string, missingUserId?: string){
        super('Wallet not found', 404, 'WALLET_NOT_FOUND')
        this.missingWalletId = missingWalletId;
        this.missingUserId = missingUserId
    }
}

export class NotABusinessDayException extends DomainException
{
    constructor(){
        super('Sorry! Transactions can only be made on business days.', 422, 'NOT_BUSINESS_DAY')
    }
}

export class ChargeNotFoundException extends DomainException
{
    private readonly missingChargeId: string;

    constructor(missingChargeId: string){
        super('Charge not found.', 404, 'CHARGE_NOT_FOUND');
        this.missingChargeId = missingChargeId;
    }
}

export class ChargePaidOrExpiredException extends DomainException
{
    private readonly chargeId: string;

    constructor(chargeId: string){
        super('Charge has been paid or expired.', 422, 'CHARGE_UNAVAILABLE');
        this.chargeId = chargeId;
    }
}


export class TransactionAttachedToNotPaidCharge extends DomainException
{
    private readonly chargeId: string;
    private readonly transactionId;

    constructor(chargeId: string, transactionId: string){
        super("You can't attach a transaction to a not paid charge", 422, 'CHARGE_NOT_PAID');
        this.chargeId = chargeId;
        this.transactionId = transactionId;
    }
}

export class ChargeAlreadyHasTransactionException extends DomainException
{
    private readonly chargeId: string;
    private readonly transactionId;

    constructor(chargeId: string, transactionId: string){
        super("You can't attach a transaction to a charge that already has a transaction attached", 422, 'CHARGE_ALREADY_ATTACHED');
        this.chargeId = chargeId;
        this.transactionId = transactionId;
    }
}


export class ChargePaidByIssuerException extends DomainException
{
    private readonly issuerWalletId;
    private readonly chargeId;

    constructor(issuerWalletId: string, chargeId: string){
        super("A charge can't be paid by the issuer", 422, 'ISSUER_CANNOT_PAY');
        this.issuerWalletId = issuerWalletId;
        this.chargeId = chargeId;
    }
}


export class AuthorizationFailedException extends DomainException
{
    constructor(message: string){
        super(message, 401, 'AUTHORIZATION_FAILED');
    }
}


export class TokenExpiredException extends DomainException
{
    constructor(){ super('Token has expired.', 401, 'TOKEN_EXPIRED') }
}


export class TokenInvalidException extends DomainException
{
    constructor(){ super('Token is malformed or invalid.', 401, 'TOKEN_INVALID') }
}


export class TokenNotBeforeException extends DomainException
{
    constructor(){ super('Token is not yet valid.', 401, 'TOKEN_NOT_ACTIVE') }
}

export class RefreshTokenNotProvidedException extends DomainException
{
    constructor(){ super('Refresh token not provided.', 401, 'REFRESH_TOKEN_MISSING') }
}


export class ConfirmPasswordDoNotMatchException extends DomainException
{
    constructor(){ super('Confirm password is different than typed password', 422, 'PASSWORD_CONFIRMATION_MISMATCH') }
}


export class WrongPasswordException extends DomainException
{
    constructor(){ super('Wrong password', 401, 'WRONG_PASSWORD') }
}


export class UserRoleNotAllowedException extends DomainException
{
    private readonly role: string;

    constructor(role: string){
        super('User role not allowed.', 403, 'USER_ROLE_NOT_ALLOWED');
        this.role = role;
    }
}


export class UserNotFoundException extends DomainException
{
    private readonly userId?: string;
    private readonly userEmail?: string;

    constructor(userId?: string, userEmail?: string){ 
        super('User not found.', 404, 'USER_NOT_FOUND');
        this.userId = userId;
    }
}


export class EmailAlreadyExistsException extends DomainException
{
    private readonly existentEmail?: string

    constructor(existentEmail: string){
        super('Email already exists', 422, 'EMAIL_ALREADY_EXISTS');
        this.existentEmail = existentEmail;
    }
}
