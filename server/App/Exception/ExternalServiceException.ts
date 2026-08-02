abstract class ExternalServiceException extends Error 
{
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ExternalBusinessDayServiceException extends ExternalServiceException
{
    constructor(){
        super("The external business day verification service doesn't respond", 502);
    }
}