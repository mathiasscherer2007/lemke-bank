import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";

export class AuthMockMiddleware
{
    constructor(){}

    public async authenticate(request: FastifyRequest, reply: FastifyReply)
    {
        request.user = {
            id: crypto.randomUUID(),
            name: "John Doe",
            email: "john@doe.com"
        }
    }
}