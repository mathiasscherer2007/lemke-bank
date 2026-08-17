import { injectAll, injectable } from 'tsyringe';
import type { FastifyInstance } from 'fastify';
import { Controller } from '../App/Controller/Controller.js';

@injectable()
export class Router {
    constructor(@injectAll('Controller') private controllers: Controller[]) {}

    public registerAll(app: FastifyInstance) {
        for (const controller of this.controllers) {
            controller.registerRoutes(app);
        }
    }
}