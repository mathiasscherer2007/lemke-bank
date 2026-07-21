import fastify from "fastify";
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";

export async function buildApp(options: object = {})
{
    const app = fastify(options).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.decorateRequest("user", null);
    app.get('/', async (request, reply) => {
        return reply.send({
            message: "Hello World"
        });
    })

    return app;
}