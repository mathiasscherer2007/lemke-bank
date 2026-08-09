import { Charge } from "../../Model/Charge.js";

export interface ChargeRepository
{
    findById(id: string): Promise<Charge | null>;
    create(charge: Charge): Promise<void>;
    update(charge: Charge): Promise<void>;
}

const ChargeRepository = 'ChargeRepository';