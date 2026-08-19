import { createClient, RedisClient, RedisClientType } from 'redis'
import { CacheProviderException } from '../../Exception/InfrastructureException.js';
import { JwtPayload } from 'jsonwebtoken';

export class RedisTokenBlacklistingService
{
    private prefix = "token_blacklist";
    private client: RedisClientType

    constructor(
        url: string
    ){
        this.client = createClient({ url: url, keyPrefix: this.prefix })
            .on("error", (error) => { throw new CacheProviderException(error) });
    }

    public async blacklist(decodedToken: JwtPayload): Promise<void>
    {
        if(!this.client.isOpen) await this.client.connect();
        
        const currentTime = Math.floor(Date.now() / 1000);
        const { jti, exp } = decodedToken;

        const ttl = exp! - currentTime;
        await this.client.set(jti!, '0', { expiration: { type: 'EX', value: ttl } });
    }

    public async exists(decodedToken: JwtPayload): Promise<boolean>
    {
        if(!this.client.isOpen) await this.client.connect();

        const { jti } = decodedToken;
        return await this.client.exists(this.prefix + jti) >= 1;
    }
}