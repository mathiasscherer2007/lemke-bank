import type { RouteGenericInterface } from "fastify";
import { AppContainer } from "../Provider/AppContainer.ts";
import { UserRole } from "../Model/Enum/UserRole.ts";

declare module "fastify" {
    interface FastifyRequest<
        // Necessary to declare module, without redeclare it with just user property
        RouteGeneric extends RouteGenericInterface = RouteGenericInterface 
    > {
        user: {
            id: string;
            email: string;
            role: UserRole;
        } | null;
    }
    interface FastifyInstance 
    {
        container: AppContainer
    }
}