import { FastifyReply, FastifyRequest } from "fastify";
import { UserParamsSchema, UserSearchQuerySchema } from "../../Dto/Request.js";
import { UserManagementService } from "../../Service/UserManagementService.js";
import { Controller } from "./Controller.js";

export class UserController extends Controller
{
    constructor(
        private readonly userManagementService: UserManagementService
    ){
        super();
        this.searchUser = this.searchUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    public async searchUser(request: FastifyRequest<{ Querystring: UserSearchQuerySchema }>, reply: FastifyReply) {
        const { query, limit } = request.query;
        const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s]/g, ''); // Handle special characters

        const users = await this.userManagementService.searchUser(sanitizedQuery, limit);
        return reply.status(200).send(users);
    }

    public async deleteUser(request: FastifyRequest<{ Params: UserParamsSchema }>, reply: FastifyReply) {
        const { userId } = request.params;
        await this.userManagementService.deleteUser(userId);
        return reply.status(204).send();
    }
}