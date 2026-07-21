import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionProcessorService } from "../../Service/TransactionProcessorService.js";
import { PaymentByWalletIdDTO } from "../../Dto/Request.js";

export class TransactionController 
{
    constructor(
        private readonly service: TransactionProcessorService
    ){}

    public async transactionByWalletId(request: FastifyRequest<{ Body: PaymentByWalletIdDTO }>, reply: FastifyReply)
    {
        const payload = request.body;
        const userId = request.user!.id; 
        
        const transaction = this.service.processByWalletId(payload, userId);
        return reply.status(201).send({
            status: "succesfull",
            message: "Transaction succesfull created",
            data: transaction
        });
    }
}