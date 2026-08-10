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

export class AppServiceProvider
{
    /**
     * Register app container services.
     */
    public static boot(container: AppContainer): void 
    {
        // Wallet Services
        container.register(WalletRepository, () => new DrizzleWalletRepository(), true);
        container.register(WalletManagementService, c => new WalletManagementService(c.get(WalletRepository)), true);

        // Wallet Controller
        container.register(WalletController, c => new WalletController(c.get(WalletManagementService)));

        // Statement Services
        container.register(StatementRepository, () => new DrizzleStatementRepository(), true);
        container.register(StatementGenerationService, c => new StatementGenerationService(c.get(WalletRepository), c.get(StatementRepository)), true);

        // Statement Controller
        container.register(StatementController, c => new StatementController(c.get(StatementGenerationService)));

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

        // User Services
        container.register(UserRepository, c => new DrizzleUserRepository(), true);

        // Auth Services
        container.register(TokenService, c => new JwtTokenService(env.API_SECRET!), true);
        container.register(AuthService, c => new AuthService(c.get(UserRepository), c.get(TokenService)), true)

        // Middleware example
        container.register(AuthMiddleware, c => new AuthMiddleware(c.get(UserRepository), c.get(TokenService)));

        // Auth Controller
        container.register(AuthController, c => new AuthController(c.get(AuthService)));
    }
}