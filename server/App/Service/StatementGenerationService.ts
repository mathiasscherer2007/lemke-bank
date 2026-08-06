import { WalletNotFoundException } from "../Exception/DomainException.js";
import { Statement } from "../Model/Statement.js";
import { StatementRepository } from "../Repository/Statement/StatementRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { DateStatementGroup } from "../Types/domain.js";

export class StatementGenerationService
{
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly statementRepository: StatementRepository
    ){}

    public async generate(userId: string, month: number, year: number): 
    Promise<{ 
        openingBalance: number, 
        entries: DateStatementGroup[], 
        walletCreationDate: Date 
    }>
    {
        const wallet = await this.walletRepository.findById(userId);
        if(!wallet) throw new WalletNotFoundException(undefined, userId);

        const startDate = new Date('${year}-${month}-01');
        const endDate = new Date('${year}-${month + 1}-01');

        const entries = await this.statementRepository.findTransactions(wallet.getId(), startDate, endDate);
        const statement = new Statement(wallet.getId(), entries);
        
        return { 
            openingBalance: statement.getOpeningBalance(), 
            entries: statement.groupByDate(entries),
            walletCreationDate: wallet.getCreationDate()
        };
    }
}