import "reflect-metadata";
import './di.js';
import fastify from "fastify";
import { container } from 'tsyringe';
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
<<<<<<< HEAD
import { protectedRoutes } from "./Routes/protected.js";
import { AppContainer } from "./Provider/AppContainer.js";
import { AppServiceProvider } from "./Provider/AppServiceProvider.js";
import { publicRoutes } from "./Routes/public.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
=======
import { Router } from "./route.js";
>>>>>>> ed9f60a6e0b1a58d5fbc1f797f7a47b3db0c08aa

export async function buildApp(options: object = {})
{
    const app = fastify(options).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorateRequest("user", null);

    const container = new AppContainer();
    AppServiceProvider.boot(container);
    app.decorate('container', container)

    // Swagger routes
    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Lemke-Bank API',
                version: '0.0.1'
            }
        },
        transform: jsonSchemaTransform
    });

    app.register(fastifySwaggerUi, {
        routePrefix: '/docs'
    });

    app.register(publicRoutes);
    app.register(protectedRoutes);

    container.resolve(Router).registerAll(app);

    return app;
}
