import { JwtPayload } from "jsonwebtoken";

export interface TokenBlacklistingService
{
    blacklist(decodedToken: JwtPayload): Promise<void>;
    exists(decodedToken: JwtPayload): Promise<boolean>;
}