import { FastifyReply, FastifyRequest } from "fastify";
import { ChargePaymentService } from "../../Service/ChargePaymentService.js";
import { Controller } from "./Controller.js";
import { ChargeParamsSchema, CreateChargeDTO } from "../../Dto/Request.js";
import { ChargeCreationService } from "../../Service/ChargeCreationService.js";

export class ChargeController extends Controller
{
    constructor(
        private readonly chargePaymentService: ChargePaymentService,
        private readonly chargeCreationService: ChargeCreationService
    ){
        super();
        this.createCharge = this.createCharge.bind(this);
        this.getCharge = this.getCharge.bind(this);
        this.payCharge = this.payCharge.bind(this);
    }

    public async getCharge(request: FastifyRequest<{ Params: ChargeParamsSchema }>, reply: FastifyReply)
    {
        const userId = request.user!.id;
        const id = request.params.chargeId;
        const chargeData = await this.chargePaymentService.getData(id, userId);

        return reply.status(200).send(chargeData);
    }

    public async createCharge(request: FastifyRequest<{ Body: CreateChargeDTO }>, reply: FastifyReply)
    {
        const userId = request.user!.id
        const payload = request.body;
        const charge = await this.chargeCreationService.create(payload, userId);

        return reply.status(201).send({
            status: "succesfull",
            message: "Charge succesfull created",
            charge: charge
        });
    }

    public async payCharge(request: FastifyRequest<{ Params: ChargeParamsSchema }>, reply: FastifyReply)
    {
        const chargeId = request.params.chargeId;
        const userId = request.user!.id;

        const transaction = await this.chargePaymentService.makePaymentTransaction(chargeId, userId);

        return reply.status(200).send({
            status: 'successful',
            message: 'Charge successfully paid.',
            transaction: transaction
        });
    }
}