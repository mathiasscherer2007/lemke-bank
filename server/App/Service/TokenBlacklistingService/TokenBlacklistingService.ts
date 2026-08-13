import { JwtPayload } from "jsonwebtoken";

export interface TokenBlacklistingService
{
    blacklist(decodedToken: JwtPayload): void;
    exists(): string;
}