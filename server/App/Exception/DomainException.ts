abstract class DomainException extends Error 
{
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class UnbalancedTransactionException extends DomainException
{
    constructor() {
        super('Transaction is not balanced: total credit does not equal total debit.', 422);
    }
}

export class MissingTransactionLedgerEntryTypeException extends DomainException
{
    private readonly missingType: 'credit' | 'debit';

    constructor(missingType: 'credit' | 'debit') {
        super('Transaction must have at least one credit and one debit entry.', 422);
        this.missingType = missingType;
        this.message = `Transaction is missing a ${this.missingType} entry.`;
    }
}

export class TransactionNotFoundException extends DomainException
{
    private readonly missingId: string;

    constructor(missingId: string){
        super('Transaction not found.', 404);
        this.missingId = missingId;
    }
}

export class InsufficientFundsException extends DomainException
{
    constructor(){
        super('Insufficient funds to complete this transaction.', 422);
    }
}

export class WalletNotFoundException extends DomainException
{
    private readonly missingWalletId?: string;
    private readonly missingUserId?: string;

    constructor(missingWalletId?: string, missingUserId?: string){
        super('Wallet not found', 404)
        this.missingWalletId = missingWalletId;
        this.missingUserId = missingUserId
    }
}

export class NotABusinessDayException extends DomainException
{
    constructor(){
        super('Sorry! Transactions can only be made on business days.', 422)
    }
}

export class ChargeNotFoundException extends DomainException
{
    private readonly missingChargeId: string;

    constructor(missingChargeId: string){
        super('Charge not found.', 404);
        this.missingChargeId = missingChargeId;
    }
}

export class ChargePaidOrExpiredException extends DomainException
{
    private readonly chargeId: string;

    constructor(chargeId: string){
        super('Charge has been paid or expired.', 422);
        this.chargeId = chargeId;
    }
}


export class TransactionAttachedToNotPaidCharge extends DomainException
{
    private readonly chargeId: string;
    private readonly transactionId;

    constructor(chargeId: string, transactionId: string){
        super("You can't attach a transaction to a not paid charge", 422);
        this.chargeId = chargeId;
        this.transactionId = transactionId;
    }
}

export class ChargeAlreadyHasTransactionException extends DomainException
{
    private readonly chargeId: string;
    private readonly transactionId;

    constructor(chargeId: string, transactionId: string){
        super("You can't attach a transaction to a charge that already has a transaction attached", 422);
        this.chargeId = chargeId;
        this.transactionId = transactionId;
    }
}


export class ChargePaidByIssuerException extends DomainException
{
    private readonly issuerWalletId;
    private readonly chargeId;

    constructor(issuerWalletId: string, chargeId: string){
        super("A charge can't be paid by the issuer", 422);
        this.issuerWalletId = issuerWalletId;
        this.chargeId = chargeId;
    }
}


export class AuthorizationFailedException extends DomainException
{
    constructor(message: string){
        super(message, 401);
    }
}


export class TokenExpiredException extends DomainException
{
    constructor(){ super('Token has expired.', 401) }
}


export class TokenInvalidException extends DomainException
{
    constructor(){ super('Token is malformed or invalid.', 401) }
}


export class TokenNotBeforeException extends DomainException
{
    constructor(){ super('Token is not yet valid.', 401) }
}

export class RefreshTokenNotProvidedException extends DomainException
{
    constructor(){ super('Refresh token not provided.', 401) }
}


export class ConfirmPasswordDoNotMatchException extends DomainException
{
    constructor(){ super('Confirm password is different than typed password', 422) }
}


export class WrongPasswordException extends DomainException
{
    constructor(){ super('Wrong password', 401) }
}


export class UserNotFoundException extends DomainException
{
    private readonly userId?: string;
    private readonly userEmail?: string;

    constructor(userId?: string, userEmail?: string){ 
        super('User not found.', 404);
        this.userId = userId;
    }
}


export class EmailAlreadyExistsException extends DomainException
{
    private readonly existentEmail?: string

    constructor(existentEmail: string){
        super('Email already exists', 422);
        this.existentEmail = existentEmail;
    }
}