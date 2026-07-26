import fastify from "fastify";
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { protectedRoutes } from "./Routes/protected.js";
import { AppContainer } from "./Provider/AppContainer.js";
import { AppServiceProvider } from "./Provider/AppServiceProvider.js";

export async function buildApp(options: object = {})
{
    const app = fastify(options).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorateRequest("user", null);

    const container = new AppContainer();
    AppServiceProvider.boot(container);
    app.decorate('container', container)

    app.register(protectedRoutes);

    return app;
}