import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParams } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";

export class WalletController extends Controller
{
    constructor(
        private readonly service: WalletManagementService
    ){
        super();
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
        const userId = request.user!.id;
        const { month, year } = request.params
        const entries = this.service.getStatement(userId, month, year);
        // TODO: Implement zod schema to this route params
    }

    public generateStatementLinks(walletCreatedDate: Date)
    {
        const currentDate = new Date();
        console.log(currentDate.getMonth())

        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        console.log(walletCreatedDate.getFullYear());

        const links = [];

        while((month >= walletCreatedDate.getMonth() + 1 && year === walletCreatedDate.getFullYear()) || year > walletCreatedDate.getFullYear()){
            links.push(`${ this.API_HOST }:${ this.API_PORT }?month=${ month }&year=${ year }`);
            
            if(month === 1){
                year--;
                month = 12;
                continue;
            }
            month--
        }

        return links;
    }
}