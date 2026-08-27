import crypto from 'node:crypto';
import { z } from 'zod';
import { pool } from '../Config/Database/connection.js';
import { DrizzleUserRepository } from '../App/Repository/User/DrizzleUserRepository.js';
import { DrizzleWalletRepository } from '../App/Repository/Wallet/DrizzleWalletRepository.js';
import { DrizzleWalletCreditRepository } from '../App/Repository/WalletCredit/DrizzleWalletCreditRepository.js';
import { User } from '../App/Model/User.js';
import { UserRole } from '../App/Model/Enum/UserRole.js';
import { Wallet } from '../App/Model/Wallet.js';

const argumentsSchema = z.object({
    email: z.email(),
    name: z.string().trim().min(3).max(50),
    password: z.string().min(6),
    initialBills: z.coerce.number().int().nonnegative(),
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
        email: rawArguments.email,
        name: rawArguments.name,
        password: rawArguments.password,
        initialBills: rawArguments['initial-bills'] ?? '0',
    });

    if (!result.success) {
        throw new Error(
            'Usage: npm run create-admin -- --email <email> --name <name> --password <password> [--initial-bills <integer>]',
        );
    }

    const { email, name, password, initialBills } = result.data;
    const userRepository = new DrizzleUserRepository();
    const walletRepository = new DrizzleWalletRepository();
    const walletCreditRepository = new DrizzleWalletCreditRepository();

    if (await userRepository.findByEmail(email)) {
        throw new Error(`A user with the email ${email} already exists.`);
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const user = new User(email, passwordHash, name, UserRole.ADMIN);
    await userRepository.save(user);

    const wallet = new Wallet(user.getId());
    await walletRepository.create(wallet);

    let balance = 0;
    if (initialBills > 0) {
        ({ balance } = await walletCreditRepository.creditWallet(
            wallet.getId(),
            initialBills,
            'Crédito administrativo via CLI',
        ));
    }

    console.log(`Admin user created: ${user.getId()}`);
    console.log(`Wallet created: ${wallet.getId()}`);
    console.log(`Initial balance: ${balance} BL$`);
}

try {
    await main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await pool.end();
}
