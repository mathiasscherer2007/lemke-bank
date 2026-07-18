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