import { FastifyReply, FastifyRequest } from "fastify";
import { ChargePaymentService } from "../../Service/ChargePaymentService.js";
import { Controller } from "./Controller.js";
import { ChargeParamsSchema, CreateChargeDTO } from "../../Dto/Request.js";

export class ChargeController extends Controller
{
    constructor(
        private readonly chargePaymentService: ChargePaymentService
    ){

    }

    public async getCharge(request: FastifyRequest<{ Params: ChargeParamsSchema }>, reply: FastifyReply)
    {
        const id = request.params.chargeId;
        const charge = await this.chargePaymentService.getData(id);

        reply.status(200).send(charge);
    }

    public async createCharge(request: FastifyRequest<{ Body: CreateChargeDTO }>, reply: FastifyReply)
    {
        
    }

    public async payCharge(request: FastifyRequest<{ Params: ChargeParamsSchema }>, reply: FastifyReply)
    {
        
    }
}