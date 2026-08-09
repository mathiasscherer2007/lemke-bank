import { Charge } from "../../Model/Charge.js";
import { ChargeRepository } from "./ChargeRepository.js";
import { ChargeStatus } from "../../Model/Enum/ChargeStatus.js";

export class MockChargeRepository implements ChargeRepository {
    private readonly store: Map<string, Record<string, any>> = new Map();

    public async findById(id: string): Promise<Charge | null> {
        const raw = this.store.get(id);
        if (!raw) return null;

        return new Charge(
            raw.issuerWalletId,
            raw.amount,
            raw.description,
            raw.id,
            raw.status as ChargeStatus,
            raw.createdAt ? new Date(raw.createdAt) : undefined,
            raw.expiresAt ? new Date(raw.expiresAt) : null,
            raw.payerWalletId ?? undefined,
            raw.paymentTransactionId ?? undefined,
            raw.paidAt ? new Date(raw.paidAt) : null
        );
    }

    public async create(charge: Charge): Promise<void> {
        const primitives = charge.toPrimitives() as Record<string, any>;
        // Store a shallow copy to avoid external mutations
        this.store.set(primitives.id as string, { ...primitives });
    }

    public async update(charge: Charge): Promise<void> {
        const primitives = charge.toPrimitives() as Record<string, any>;
        if (!this.store.has(primitives.id as string)) {
            // For a mock, silently create if missing
            this.store.set(primitives.id as string, { ...primitives });
            return;
        }

        this.store.set(primitives.id as string, { ...primitives });
    }

    // Small helper used in tests to seed or clear the repository
    public seed(charge: Charge): void {
        const primitives = charge.toPrimitives() as Record<string, any>;
        this.store.set(primitives.id as string, { ...primitives });
    }

    public clear(): void {
        this.store.clear();
    }
}
