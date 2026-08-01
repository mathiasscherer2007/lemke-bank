import { FastifyReply, FastifyRequest } from "fastify";
import { WalletManagementService } from "../../Service/WalletManagementService.js";
import { GetWalletParamsSchema, StatementQueryStringSchema } from "../../Dto/Request.js";
import { Controller } from "./Controller.js";
import { LedgerEntry } from "../../Model/LedgerEntry.js";

export class WalletController extends Controller
{
    constructor(
        private readonly service: WalletManagementService
    ){
        super();
        this.getWallet = this.getWallet.bind(this);
        this.getStatement = this.getStatement.bind(this);
    }

    public async getWallet(request: FastifyRequest<{ Params: GetWalletParamsSchema }>, reply: FastifyReply)
    {
        const id = request.params.id;
        const wallet = this.service.getWalletData(id);
        return reply.status(200).send(wallet);
    }

    public async getStatement(request: FastifyRequest<{ Querystring: StatementQueryStringSchema }>, reply: FastifyReply)
    {
        const userId = request.user!.id;
        let { month, year } = request.query;

        let entries: LedgerEntry[];
        let walletCreationDate: Date;

        if(month && year){
            ({ entries, walletCreationDate } = await this.service.getStatement(userId, month, year));
        } else {
            const today = new Date();
            ({entries, walletCreationDate } = await this.service.getStatement(userId, today.getMonth() + 1, today.getFullYear()));
        }

        const links = this.generateStatementLinks(walletCreationDate);
        
        return reply.status(200).send({
            data: entries,
            links: links
        });
    }

    public generateStatementLinks(walletCreatedDate: Date)
    {
        const currentDate = new Date();

        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const walletMonth = walletCreatedDate.getMonth() + 1;
        const walletYear = walletCreatedDate.getFullYear();

        const links = [];

        while((month >= walletMonth && year === walletYear) || year > walletYear){
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