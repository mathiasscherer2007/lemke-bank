import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParams } from "../../Dto/Request.js";

export class WalletController 
{
    constructor(
        private readonly service: WalletManagementService
    ){
        this.getWallet = this.getWallet.bind(this);
    }

    public async getWallet(request: FastifyRequest<{ Params: GetWalletParams }>, reply: FastifyReply)
    {
        const id = request.params.id;
        const wallet = this.service.getWalletData(id);
        return reply.status(200).send(wallet);
    }
}