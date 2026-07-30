import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParams } from "../../Dto/Request.js";

export class WalletController 
{
    constructor(
        private readonly service: WalletManagementService,
        private readonly API_ADDRESS: string
    ){
        this.getWallet = this.getWallet.bind(this);
        this.getStatement = this.getStatement.bind(this);
    }

    public async getWallet(request: FastifyRequest<{ Params: GetWalletParams }>, reply: FastifyReply)
    {
        const id = request.params.id;
        const wallet = this.service.getWalletData(id);
        return reply.status(200).send(wallet);
    }

    public async getStatement(request: FastifyRequest, reply: FastifyReply)
    {

    }

    private async generateStatementLinks(walletCreatedDate: Date)
    {
        const currentDate = new Date();
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();

        const monthsAccountAge = (year - walletCreatedDate.getFullYear()) * 12 + (month - walletCreatedDate.getMonth());
        const links = [];

        while(month >= walletCreatedDate.getMonth() || year >= walletCreatedDate.getFullYear()){
            links.push(`${ this.API_ADDRESS }?month=${ month }&year=${ year }`);
        }

        // TODO: Base controller class with static API_HOST + API_PORT property
        
    }
}