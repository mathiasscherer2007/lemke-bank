import { MiddlewareDeclaration, Route } from "../Types/route.js";

export class Router 
{
    public async init(middlewares: MiddlewareDeclaration[])
    {
        for (const middleware of middlewares){
            
            for (const route of middleware.routes)
        }
    }
}