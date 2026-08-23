abstract class InfrastructureException extends Error 
{
    public statusCode: number;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class ServiceProviderTokenNotFound extends InfrastructureException
{
    private readonly missingToken: any

    constructor(missingToken: any){
        super('AppContainer could not resolve all service providers', 500, 'SERVICE_PROVIDER_MISSING');
        this.missingToken = missingToken;
        this.message = `AppContainer could not resolve service provider for ${missingToken}`;
    }
}

export class CacheProviderException extends InfrastructureException
{
    private readonly error;

    constructor(error: Error){
        super('Cache provider error', 500, 'CACHE_PROVIDER_ERROR');
        this.error = error;
    }
}
