import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../../Service/AuthService.js";
import { Controller } from "./Controller.js";
import { UserLoginDTO, UserSignupDTO } from "../../Dto/Request.js";

export class AuthController extends Controller
{
    constructor(
        private readonly authService: AuthService,
    ){
        super();
    }

    public async signup(request: FastifyRequest<{ Body: UserSignupDTO }>, reply: FastifyReply)
    {
        const payload = request.body;
        const { accessToken, accessTokenTTL, refreshToken, refreshTokenTTL, user } = await this.authService.register(payload);

        return reply.status(201)
        .headers({
            "x-access-token": accessToken,
            "x-access-token-ttl": accessTokenTTL,
            "x-refresh-token": refreshToken,
            "x-refresh-token-ttl": refreshTokenTTL
        })
        .send(user);
    }

    public async login(request: FastifyRequest<{ Body: UserLoginDTO }>, reply: FastifyReply)
    {
        const payload = request.body;
        const { accessToken, accessTokenTTL, refreshToken, refreshTokenTTL, user } = await this.authService.authenticate(payload);

        return reply.status(201)
        .headers({
            "x-access-token": accessToken,
            "x-access-token-ttl": accessTokenTTL,
            "x-refresh-token": refreshToken,
            "x-refresh-token-ttl": refreshTokenTTL
        })
        .send(user);
    }
}