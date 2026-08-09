import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionProcessorService } from "../../Service/TransactionProcessorService.js";
import { PaymentByWalletIdDTO } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";

export class TransactionController extends Controller
{
    constructor(
        private readonly transactionProcessorService: TransactionProcessorService
    ){
        super();
        this.transactionByWalletId = this.transactionByWalletId.bind(this);
    }

    public async transactionByWalletId(request: FastifyRequest<{ Body: PaymentByWalletIdDTO }>, reply: FastifyReply)
    {
        const payload = request.body;
        const userId = request.user!.id; 
        
        const transaction = this.transactionProcessorService.process(payload, userId);
        return reply.status(201).send({
            status: "succesfull",
            message: "Transaction succesfull created",
            transaction: transaction
        });
    }
}