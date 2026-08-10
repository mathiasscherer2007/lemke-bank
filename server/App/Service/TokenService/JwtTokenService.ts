import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../../Model/User.js";
import { TokenType } from "../../Model/Enum/TokenType.js";
import { TokenService } from "./TokenService.js";
import { TokenExpiredException, TokenInvalidException, TokenNotBeforeException } from "../../Exception/DomainException.js";

export class JwtTokenService implements TokenService
{
    private readonly secret: string;
    private readonly accessTokenTTL = 1000 * 60 * 10; // 10 minutes of TTL for access token
    private readonly refreshTokenTTL = 1000 * 60 * 60 * 24 * 7; // 7 days of TTL for refresh token

    constructor(secret: string){
        this.secret = secret;
    }

    public verify(token: string): JwtPayload
    {
        try {
            return jwt.verify(token, this.secret) as JwtPayload;
        } catch (err: any) {
            if(err.name === 'TokenExpiredError') throw new TokenExpiredException();
            else if(err.name === 'NotBeforeError') throw new TokenNotBeforeException();
            else throw new TokenInvalidException();
        }
    }

    public sign(user: User, tokenType: TokenType): string
    {
        return jwt.sign({ 
            sub: user.getId(), 
            email: user.getEmail(), 
            role: user.getRole()
        },
        this.secret, 
        {
            algorithm: 'HS256',
            expiresIn: TokenType.REFRESH_TOKEN ? this.refreshTokenTTL : this.accessTokenTTL
        });
    }

    public getAccessTokenTTL(): number { return this.accessTokenTTL }
    public getRefreshTokenTTL(): number { return this.refreshTokenTTL }
}