import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParamsSchema, StatementQueryStringSchema } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";
import { StatementGenerationService } from "../../Service/StatementGenerationService.js";
import { DateStatementGroup } from "../../Types/domain.js";

export class WalletController extends Controller
{
    constructor(
        private readonly walletManagementService: WalletManagementService
    ){
        super();
        this.getWallet = this.getWallet.bind(this);
    }

    public async getWallet(request: FastifyRequest<{ Params: GetWalletParamsSchema }>, reply: FastifyReply)
    {
        const id = request.params.id;
        const wallet = this.walletManagementService.getWalletData(id);
        return reply.status(200).send(wallet);
    }
}