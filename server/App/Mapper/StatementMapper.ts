import { LedgerEntry } from "../Model/LedgerEntry.js";
import { Transaction } from "../Model/Transaction.js";
import { User } from "../Model/User.js";

export class StatementMapper
{
    public static toStatementResponse(entries: LedgerEntry[], users: User[]): StatementEntryDto[]
    {
        const usersMap = new Map(users.map(user => [user.getId(), user]));

        const statementEntries: StatementEntryDto[] = [];

        for(const entry of entries){
            const user = usersMap.get(entry.getCounterpartyWalletId());
            if(!user){
                // TODO: Change this generic error to a more specific one, like UserNotFoundException
                throw new Error(`User not found for wallet ID: ${entry.getWalletId()}`);
            }

            statementEntries.push({
                ...entry.toPrimitives(),
                counterPartyUsers: user
                
            });
        }

        return {
            entries: statementEntries
        };
    }
}