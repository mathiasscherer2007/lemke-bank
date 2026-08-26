import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParamsSchema } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";
import { AnyARecord } from "node:dns";

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
        const { user, wallet }= await this.walletManagementService.getWalletData(id);
        
        const userData = user.toPrimitives() as any;
        delete userData.passwordHash;

        return reply.status(200).send({ ...wallet, user: userData });
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