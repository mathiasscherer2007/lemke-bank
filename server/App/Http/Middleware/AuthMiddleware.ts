import { FastifyReply, FastifyRequest } from "fastify";
import { AuthorizationFailedException } from "../../Exception/DomainException.js";
import { UserRepository } from "../../Repository/User/UserRepository.js";
import { TokenService } from "../../Service/TokenService/TokenService.js";
import { TokenType } from "../../Model/Enum/TokenType.js";
import { TokenBlacklistingService } from "../../Service/TokenBlacklistingService/TokenBlacklistingService.js";

export class AuthMiddleware
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly tokenBlacklistingService: TokenBlacklistingService
    ){
        this.authenticate = this.authenticate.bind(this);
    }

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

            const isBlacklited = await this.tokenBlacklistingService.exists(decoded);
            if(isBlacklited) throw new AuthorizationFailedException('Refresh token is blacklisted.');

            const user = await this.userRepository.findById(decoded.sub!);
            if(!user) throw new AuthorizationFailedException("Refresh token subscriber doesn't exist.");

            const token = this.tokenService.sign(user, TokenType.ACCESS_TOKEN);

            request.user = { 
                id: user.getId(), 
                email: user.getEmail(),  
                role: user.getRole()
            }

            reply.header('x-access-token', token);
            reply.header('x-access-token-ttl', this.tokenService.getAccessTokenTTL());
        } else {
            throw new AuthorizationFailedException('Refresh token not provided.');
        }
    }
}
