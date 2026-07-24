import { container } from 'tsyringe';
import { DrizzleUserRepository } from '../App/Repository/User/DrizzleUserRepository.js';
import { CreateUserUseCase } from '../App/UseCase/User/CreateUserUseCase.js';
import { LoginUseCase } from '../App/UseCase/User/LoginUseCase.js';
import { UserController } from '../App/Controller/UserController.js';

container.register('UserRepository', { useClass: DrizzleUserRepository });
container.register('CreateUserUseCase', { useClass: CreateUserUseCase });
container.register('LoginUseCase', { useClass: LoginUseCase });

container.register('Controller', { useToken: UserController });

export { container };