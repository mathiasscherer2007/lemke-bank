import fastify from "fastify";
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { protectedRoutes } from "./Routes/protected.js";

export async function buildApp(options: object = {})
{
    const app = fastify(options).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorateRequest("user", null);
    
    app.register(protectedRoutes);

    return app;
}