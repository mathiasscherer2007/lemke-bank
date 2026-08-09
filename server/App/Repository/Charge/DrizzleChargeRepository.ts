import { eq } from "drizzle-orm";
import { db } from "../../Database/connection.js";
import { charges } from "../../Database/Schema/charges.js";
import { Charge } from "../../Model/Charge.js";
import { ChargeRepository } from "./ChargeRepository.js";
import { ChargeStatus } from "../../Model/Enum/ChargeStatus.js";

export class DrizzleChargeRepository implements ChargeRepository
{
    public async findById(id: string): Promise<Charge | null> 
    {
        const [ result ] = await db.select().from(charges).where(eq(charges.id, id)).limit(1);
        if(!result) return null;

        return new Charge(
            result.issuerWalletId,
            result.amount,
            result.description,
            result.id,
            result.status as ChargeStatus,
            result.createdAt,
            result.expiresAt,
            result.payerWalletId,
            result.paymentTransactionId,
            result.paidAt
        );
    }

    public async create(charge: Charge): Promise<void> 
    {
        const primitives = charge.toPrimitives() as any;
        await db.insert(charges).values(primitives);
    }

    public async update(charge: Charge): Promise<void> 
    {
        const primitives = charge.toPrimitives() as any;
        await db.update(charges).set(primitives).where(eq(charges.id, primitives.id)); 
    }
}