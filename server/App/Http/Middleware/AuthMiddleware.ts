import { FastifyReply, FastifyRequest } from "fastify";
import { AuthorizationFailedException } from "../../Exception/DomainException.js";
import { UserRepository } from "../../Repository/User/UserRepository.js";
import { TokenService } from "../../Service/TokenService/TokenService.js";
import { TokenType } from "../../Model/Enum/TokenType.js";

export class AuthMiddleware
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ){}

    public async authenticate(request: FastifyRequest, reply: FastifyReply)
    {
        if(request.headers.authorization) {
            const decoded = this.tokenService.verify(request.headers.authorization.split(' ')[1]);
            request.user = { 
                id: decoded.sub!, 
                email: decoded.email,
                role: decoded.role
            }
        } else if (request.headers['x-refresh-token']){
            const decoded = this.tokenService.verify(request.headers['x-refresh-token'] as string);

            const user = await this.userRepository.findById(decoded.sub!);
            if(!user) throw new AuthorizationFailedException("Refresh token subscriber doesn't exist.");

            const token = this.tokenService.sign(user, TokenType.ACCESS_TOKEN);

            request.user = { 
                id: user.getId(), 
                email: user.getEmail(),  
                role: user.getRole()
            }

            reply.header('x-api-token', token);
            reply.header('x-api-token-ttl', this.tokenService.getAccessTokenTTL());
        } else {
            throw new AuthorizationFailedException('Refresh token not provided.')
        }
    }
}