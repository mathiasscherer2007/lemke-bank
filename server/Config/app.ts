import fastify from "fastify";
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { protectedRoutes } from "./Routes/protected.js";
import { AppContainer } from "./Provider/AppContainer.js";
import { AppServiceProvider } from "./Provider/AppServiceProvider.js";
import { publicRoutes } from "./Routes/public.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

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
        routePrefix: '/docs',
        uiHooks: {
            onRequest: function (request, reply, next) {
                next();
            },
            preHandler: function (request, reply, next) {
                // Add route guards or validation here
                next();
            }
        }
    });

    app.register(publicRoutes);
    app.register(protectedRoutes);

    return app;
}