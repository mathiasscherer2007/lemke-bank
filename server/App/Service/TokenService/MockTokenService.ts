import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "./TokenService.js";
import { User } from "../../Model/User.js";
import { TokenType } from "../../Model/Enum/TokenType.js";

export class MockTokenService implements TokenService {
    public readonly signCalls: Array<{ user: User; type: TokenType }> = [];
    public decodedToken: JwtPayload = { jti: "token-id" };

    public verify(): JwtPayload {
        return this.decodedToken;
    }

    public decode(): JwtPayload {
        return this.decodedToken;
    }

    public sign(user: User, type: TokenType): string {
        this.signCalls.push({ user, type });
        return type === TokenType.ACCESS_TOKEN ? "access-token" : "refresh-token";
    }

    public getAccessTokenTTL(): number {
        return 600;
    }

    public getRefreshTokenTTL(): number {
        return 3_600;
    }
}