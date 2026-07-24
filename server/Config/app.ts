import "reflect-metadata";
import './di.js';
import fastify from "fastify";
import { container } from 'tsyringe';
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { Router } from "./route.js";

export async function buildApp(options: object = {})
{
    const app = fastify(options).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.get('/', async (request, reply) => {
        return reply.send({
            message: "Hello World"
        });
    })

    container.resolve(Router).registerAll(app);

    return app;
}
