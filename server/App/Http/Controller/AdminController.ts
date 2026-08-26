import { FastifyReply, FastifyRequest } from "fastify";
import { AdminService } from "../../Service/AdminService.js";

export class AdminController
{
    constructor(
        private readonly adminService: AdminService
    ){}

    public async getOverview(request: FastifyRequest, reply: FastifyReply)
    {
        const role = request.user!.role;

        const overview = await this.adminService.getOverview(role);
        reply.status(200).send(overview);
    }
}