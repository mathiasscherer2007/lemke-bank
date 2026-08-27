import { z } from 'zod';
import { pool } from '../Config/Database/connection.js';
import { DrizzleWalletCreditRepository } from '../App/Repository/WalletCredit/DrizzleWalletCreditRepository.js';

const argumentsSchema = z.object({
    walletId: z.string().trim().min(1),
    amount: z.coerce.number().int().positive(),
});

function parseArguments(argv: string[]): Record<string, string> {
    const parsed: Record<string, string> = {};

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (!argument.startsWith('--')) {
            throw new Error(`Unexpected argument: ${argument}`);
        }

        const key = argument.slice(2);
        const value = argv[index + 1];
        if (!key || value === undefined || value.startsWith('--')) {
            throw new Error(`Missing value for --${key}`);
        }

        parsed[key] = value;
        index += 1;
    }

    return parsed;
}

async function main(): Promise<void> {
    const rawArguments = parseArguments(process.argv.slice(2));
    const result = argumentsSchema.safeParse({
        walletId: rawArguments['wallet-id'],
        amount: rawArguments.amount,
    });

    if (!result.success) {
        throw new Error(
            'Usage: npm run add-bills -- --wallet-id <wallet-id> --amount <positive-integer>',
        );
    }

    const { walletId, amount } = result.data;
    const walletCreditRepository = new DrizzleWalletCreditRepository();
    const credit = await walletCreditRepository.creditWallet(
        walletId,
        amount,
        'Crédito administrativo via CLI',
    );

    console.log(`Added ${amount} BL$ to wallet ${walletId}.`);
    console.log(`New balance: ${credit.balance} BL$`);
    console.log(`Transaction: ${credit.transactionId}`);
}

try {
    await main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await pool.end();
}
