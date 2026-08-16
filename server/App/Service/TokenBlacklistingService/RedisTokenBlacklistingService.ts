import { createClient, RedisClient, RedisClientType } from 'redis'
import { CacheProviderException } from '../../Exception/InfrastructureException.js';
import { TokenService } from '../TokenService/TokenService.js';
import { JwtPayload } from 'jsonwebtoken';

export class RedisTokenBlacklistingService
{
    private prefix = "token_blacklist";
    private client: RedisClientType

    constructor(
        host: string
    ){
        this.client = createClient({ url: host, keyPrefix: this.prefix })
            .on("error", (error) => { throw new CacheProviderException(error) });
    }

    public async blacklist(decodedToken: JwtPayload): Promise<void>
    {
        this.client.connect();
        
        const currentTime = Math.floor(Date.now() / 1000);
        const { jti, exp } = decodedToken;

        this.client.set(jti!, '0', { expiration: { type: 'EX', value: currentTime - exp! } });
    }

    public async exists(decodedToken: JwtPayload): Promise<boolean>
    {
        this.client.connect();

        const { jti } = decodedToken;
        return await this.client.exists(this.prefix + jti) < 1;
    }
}