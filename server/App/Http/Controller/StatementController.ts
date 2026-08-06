import { FastifyReply, FastifyRequest } from "fastify";
import { StatementQueryStringSchema } from "../../Dto/Request.js";
import { DateStatementGroup } from "../../Types/domain.js";
import { Controller } from "./Controller.js";
import { StatementGenerationService } from "../../Service/StatementGenerationService.js";

export class StatementController extends Controller 
{
    constructor(
        private readonly statementService: StatementGenerationService
    ){
        super();
        this.getStatement = this.getStatement.bind(this);
    }

    public async getStatement(request: FastifyRequest<{ Querystring: StatementQueryStringSchema }>, reply: FastifyReply)
    {
        const userId = request.user!.id;
        let { month, year } = request.query;

        let entries: DateStatementGroup[];
        let walletCreationDate: Date;
        let openingBalance: number;

        if(month && year){
            ({ entries, openingBalance, walletCreationDate } = await this.statementService.generate(userId, month, year));
        } else {
            const today = new Date();
            ({ entries, openingBalance, walletCreationDate } = await this.statementService.generate(userId, today.getMonth() + 1, today.getFullYear()));
        }

        const links = this.generateStatementLinks(walletCreationDate);
        
        return reply.status(200).send({
            data: {
                openingBalance: openingBalance,
                entries: entries
            },
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