abstract class InfrastructureException extends Error 
{
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ServiceProviderTokenNotFound extends InfrastructureException
{
    private readonly missingToken: any

    constructor(missingToken: any){
        super('AppContainer could not resolve all service providers', 500);
        this.missingToken = missingToken;
        this.message = `AppContainer could not resolve service provider for ${missingToken}`;
    }
}

export class CacheProviderException extends InfrastructureException
{
    private readonly error;

    constructor(error: Error){
        super('Cache provider error', 500);
        this.error = error;
    }
}