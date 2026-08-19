import { JwtPayload } from "jsonwebtoken";
import { TokenBlacklistingService } from "./TokenBlacklistingService.js";

export class MockTokenBlacklistingService implements TokenBlacklistingService {
    public readonly blacklistedTokens: JwtPayload[] = [];

    public async blacklist(decodedToken: JwtPayload): Promise<void> {
        this.blacklistedTokens.push(decodedToken);
    }

    public async exists(decodedToken: JwtPayload): Promise<boolean> {
        return this.blacklistedTokens.some(token => token.jti === decodedToken.jti);
    }
}