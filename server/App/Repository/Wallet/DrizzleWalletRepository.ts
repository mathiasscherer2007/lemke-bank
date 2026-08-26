import { and, desc, eq, inArray, or, sql } from "drizzle-orm"
import { db } from "../../../Config/Database/connection.js"
import { wallets } from "../../../Config/Database/Schema/wallets.js"
import { Wallet } from "../../Model/Wallet.js"
import { WalletStatus } from "../../Model/Enum/WalletStatus.js";
import { WalletRepository } from "./WalletRepository.js";
import { users } from "../../../Config/Database/Schema/users.js";
import { UserRole } from "../../Model/Enum/UserRole.js";
import { RichestUserWallet } from "../../../Config/Types/domain.js";

export class DrizzleWalletRepository implements WalletRepository
{
    public async create(wallet: Wallet): Promise<void>
    {
        await db.insert(wallets).values(wallet.toPrimitives() as any);
    }
    
    public async findById(id: string): Promise<Wallet | null>
    {
        const [ row ] = await db
            .select()
            .from(wallets)
            .where(
                and(
                    eq(wallets.id, id), 
                    eq(wallets.status, WalletStatus.ACTIVE)
                )
            )
            .limit(1);

        if(!row) return null;

        return new Wallet(
            row.userId, 
            row.status as WalletStatus, 
            row.balance, 
            row.id, 
            row.createdAt, 
            row.updatedAt
        );
    }

    public async findByUserId(userId: string): Promise<Wallet | null>
    {
        const [ row ] = await db
            .select()
            .from(wallets)
            .where(
                and(
                    eq(wallets.userId, userId), 
                    eq(wallets.status, WalletStatus.ACTIVE)
                )
            )
            .limit(1);

        if(!row) return null;

        return new Wallet(
            row.userId, 
            row.status as WalletStatus, 
            row.balance, 
            row.id, 
            row.createdAt, 
            row.updatedAt
        );
    }

    public async update(wallet: Wallet): Promise<void>
    {
        const primitive = wallet.toPrimitives() as any;
        await db.update(wallets).set(primitive).where(eq(wallets.id, primitive.id));
    }

    public async getMostRichestUserWallets(limit: number): Promise<RichestUserWallet[]>
    {
        const rows = await db
            .select()
            .from(wallets)
            .innerJoin(users, eq(users.id, wallets.userId))
            .where(and(eq(wallets.status, WalletStatus.ACTIVE), eq(users.role, UserRole.USER)))
            .orderBy(desc(wallets.balance))
            .limit(limit);

        return rows.map(row => {
            return {
                id: row.wallets.id,
                balance: row.wallets.balance,
                createdAt: row.wallets.createdAt,
                updatedAt: row.wallets.updatedAt,
                user: {
                    id: row.users.id,
                    email: row.users.email,
                    username: row.users.username
                }
            };
        });
    }

    public async getTotalBalance(): Promise<number>
    {
        const [ row ] = await db
            .select({
                totalBalance: sql<number>`SUM(${wallets.balance})`
            })
            .from(wallets)
            .innerJoin(users, eq(users.id, wallets.userId))
            .where(and(eq(wallets.status, WalletStatus.ACTIVE), eq(users.role, UserRole.USER)));

        return row?.totalBalance ?? 0;
    }
}