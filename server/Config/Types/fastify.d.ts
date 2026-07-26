import type { RouteGenericInterface } from "fastify";

declare module "fastify" {
    interface FastifyRequest<
        // Necessary to declare module, without redeclare it with just user property
        RouteGeneric extends RouteGenericInterface = RouteGenericInterface 
    > {
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
    }
}