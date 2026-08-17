import { FastifyPluginAsync } from "fastify";
import { AuthController } from "../../App/Http/Controller/AuthController.js";
import { userLoginDTO, userSignupDTO } from "../../App/Dto/Request.js";

export const publicRoutes: FastifyPluginAsync = async (app, options) => {

    const authController = app.container.get<AuthController>(AuthController);

    app.post("/signup", { schema: { body: userSignupDTO } }, authController.signup);
    app.post("/login", { schema: { body: userLoginDTO } }, authController.login);
}