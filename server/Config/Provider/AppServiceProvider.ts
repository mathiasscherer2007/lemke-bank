import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { AuthMiddleware } from "../../App/Http/Middleware/AuthMiddleware.js";
import { DrizzleTransactionRepository } from "../../App/Repository/Transaction/DrizzleTransactionRepository.js";
import { TransactionRepository } from "../../App/Repository/Transaction/TransactionRepository.js";
import { DrizzleWalletRepository } from "../../App/Repository/Wallet/DrizzleWalletRepository.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { BrasilApiBusinessDayService } from "../../App/Service/WebService/BusinessDay/BrasilApiBusinessDayService.js";
import { BusinessDayService } from "../../App/Service/WebService/BusinessDay/BusinessDayService.js";
import { env } from "../Environment/env.js";
import { StatementController } from "../../App/Http/Controller/StatementController.js";
import { DrizzleStatementRepository } from "../../App/Repository/Statement/DrizzleStatementRepository.js";
import { StatementRepository } from "../../App/Repository/Statement/StatementRepository.js";
import { StatementGenerationService } from "../../App/Service/StatementGenerationService.js";
import { WalletRepository } from "./../../App/Repository/Wallet/WalletRepository.js";
import { AppContainer } from "./AppContainer.js";
import { DrizzleChargeRepository } from "../../App/Repository/Charge/DrizzleChargeRepository.js";
import { ChargeRepository } from "../../App/Repository/Charge/ChargeRepository.js";
import { ChargePaymentService } from "../../App/Service/ChargePaymentService.js";
import { ChargeCreationService } from "../../App/Service/ChargeCreationService.js";
import { ChargeController } from "../../App/Http/Controller/ChargeController.js";
import { UserRepository } from "../../App/Repository/User/UserRepository.js";
import { DrizzleUserRepository } from "../../App/Repository/User/DrizzleUserRepository.js";
import { JwtTokenService } from "../../App/Service/TokenService/JwtTokenService.js";
import { TokenService } from "../../App/Service/TokenService/TokenService.js";
import { AuthService } from "../../App/Service/AuthService.js";
import { AuthController } from "../../App/Http/Controller/AuthController.js";
import { TokenBlacklistingService } from "../../App/Service/TokenBlacklistingService/TokenBlacklistingService.js";
import { RedisTokenBlacklistingService } from "../../App/Service/TokenBlacklistingService/RedisTokenBlacklistingService.js";
import { UserManagementService } from "../../App/Service/UserManagementService.js";
import { UserController } from "../../App/Http/Controller/UserController.js";

export class AppServiceProvider
{
    /**
     * Register app container services.
     */
    public static boot(container: AppContainer): void 
    {
        // Wallet, Statement and User Services
        container.register(WalletRepository, () => new DrizzleWalletRepository(), true);
        container.register(StatementRepository, () => new DrizzleStatementRepository(), true);
        container.register(UserRepository, () => new DrizzleUserRepository(), true);

        container.register(WalletManagementService, c => new WalletManagementService(c.get(WalletRepository), c.get(UserRepository), c.get(StatementRepository)), true);
        container.register(StatementGenerationService, c => new StatementGenerationService(c.get(WalletRepository), c.get(StatementRepository)), true);
        container.register(UserManagementService, c => new UserManagementService(c.get(UserRepository), c.get(WalletRepository)), true);


        // Wallet, Statement and User Controllers
        container.register(WalletController, c => new WalletController(c.get(WalletManagementService)));
        container.register(StatementController, c => new StatementController(c.get(StatementGenerationService)));
        container.register(UserController, c => new UserController(c.get(UserManagementService)));

        
        // Business Day Service
        container.register(BusinessDayService, () => new BrasilApiBusinessDayService(env.HOLIDAYS_API_URL!));

        // Transaction Services
        container.register(TransactionRepository, () => new DrizzleTransactionRepository(), true);
        container.register(
            TransactionProcessorService, 
            c => new TransactionProcessorService(
                c.get(TransactionRepository), 
                c.get(WalletRepository),
                c.get(BusinessDayService)
            ), 
            true
        );

        // Transaction Controller
        container.register(TransactionController, c => new TransactionController(c.get(TransactionProcessorService)));

        // Charge Services
        container.register(ChargeRepository, c => new DrizzleChargeRepository(), true);
        container.register(
            ChargePaymentService, 
            c => new ChargePaymentService(
                c.get(UserRepository),
                c.get(ChargeRepository),
                c.get(WalletRepository),
                c.get(TransactionProcessorService)
            ),
            true
        );
        container.register(
            ChargeCreationService,
            c => new ChargeCreationService(
                c.get(ChargeRepository),
                c.get(WalletRepository),
            ),
            true
        );

        // Charge Controller
        container.register(ChargeController, c => new ChargeController(c.get(ChargePaymentService), c.get(ChargeCreationService)), true);

        // Auth Services
        container.register(TokenService, c => new JwtTokenService(env.API_SECRET!), true);

        const redisUrl = `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;

        container.register(TokenBlacklistingService, c => new RedisTokenBlacklistingService(redisUrl), true);
        container.register(
            AuthService, 
            c => new AuthService(
                c.get(UserRepository), 
                c.get(WalletRepository),
                c.get(TokenService),
                c.get(TokenBlacklistingService)
            ), 
            true
        );

        // Middleware example
        container.register(AuthMiddleware, c => new AuthMiddleware(c.get(UserRepository), c.get(TokenService), c.get(TokenBlacklistingService)));

        // Auth Controller
        container.register(AuthController, c => new AuthController(c.get(AuthService)));
    }
}