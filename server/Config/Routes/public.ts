import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyPluginAsync } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { AuthController } from "../Http/Controller/AuthController.js";
import { userLoginDTO, userSignupDTO } from "../Dto/Request.js";

export const publicRoutes: FastifyPluginAsync = async (app, options) => {

    const authController = app.container.get<AuthController>(AuthController);

    app.post("/signup", { schema: { body: userSignupDTO } }, authController.signup);
    app.post("/login", { schema: { body: userLoginDTO } }, authController.login);
}