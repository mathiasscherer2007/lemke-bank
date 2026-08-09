import { CreateChargeDTO } from "../Dto/Request.js";
import { ChargeRepository } from "../Repository/Charge/ChargeRepository.js";

export class ChargeCreationService
{
    constructor(
        private readonly chargeRepository: ChargeRepository
    ){}

    public async create(payload: CreateChargeDTO, userId: string)
    {
        
    }
}