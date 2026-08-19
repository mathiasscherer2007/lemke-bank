import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParamsSchema } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";

export class WalletController extends Controller
{
    constructor(
        private readonly walletManagementService: WalletManagementService
    ){
        super();
        this.getWallet = this.getWallet.bind(this);
        this.overview = this.overview.bind(this);
    }

    public async getWallet(request: FastifyRequest<{ Params: GetWalletParamsSchema }>, reply: FastifyReply)
    {
        const id = request.params.walletId;
        const wallet = this.walletManagementService.getWalletData(id);
        return reply.status(200).send(wallet);
    }

    public async overview(request: FastifyRequest, reply: FastifyReply) 
    {
        const userId = request.user!.id;
        const { wallet, recentTransactions } = await this.walletManagementService.getOverview(userId);
        return reply.status(200).send({ 
            wallet: wallet, 
            recentTransactions: recentTransactions 
        });
    }
}