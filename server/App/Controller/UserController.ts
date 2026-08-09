import { FastifyInstance } from "fastify";
import { CreateUserUseCase } from "../UseCase/User/CreateUserUseCase.js";
import { LoginUseCase } from "../UseCase/User/LoginUseCase.js";
import { inject, singleton } from "tsyringe";
import { Controller } from "./Controller.js";

@singleton()
export class UserController implements Controller {
    constructor(
        @inject('CreateUserUseCase') private createUserUseCase: CreateUserUseCase,
        @inject('LoginUseCase') private loginUseCase: LoginUseCase
    ) {}

    public registerRoutes(app: FastifyInstance) {
        app.post('/users', async (request, reply) => {
            const body = request.body as any;
            try {
                const user = await this.createUserUseCase.execute({ email: body.email, password: body.password, username: body.username });
                return reply.code(201).send({ id: user.getId(), email: user.getEmail(), username: user.getUsername() });
            } catch (err: any) {
                if (err?.message === 'UserAlreadyExists') return reply.code(409).send({ error: 'User already exists' });
                return reply.code(500).send({ error: 'Internal error' });
            }
        });
    
        app.post('/login', async (request, reply) => {
            const body = request.body as any;
            console.log('Login request body:', body);
            const result = await this.loginUseCase.execute({ email: body.email, password: body.password });
            if (!result) {
                return reply.code(401).send({ error: 'Email ou senha incorretos.' });
            }
            return reply.code(200).send(result);
        });
    }
}
