abstract class ExternalServiceException extends Error 
{
    public statusCode: number;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}

export class ExternalBusinessDayServiceException extends ExternalServiceException
{
    constructor(){
        super("The external business day verification service doesn't respond", 502, 'BUSINESS_DAY_ERROR');
    }
}
