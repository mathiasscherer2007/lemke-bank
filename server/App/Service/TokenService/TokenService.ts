import { TokenType } from "../../Model/Enum/TokenType.js";
import { User } from "../../Model/User.js";
import { JwtPayload } from "jsonwebtoken";

export interface TokenService 
{
    verify(token: string): JwtPayload;
    sign(user: User, tokenType: TokenType): string;
    getAccessTokenTTL(): number;
    getRefreshTokenTTL(): number;
}

export const TokenService = 'TokenService';