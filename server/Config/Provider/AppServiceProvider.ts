import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { DrizzleTransactionRepository } from "../../App/Repository/Transaction/DrizzleTransactionRepository.js";
import { TransactionRepository } from "../../App/Repository/Transaction/TransactionRepository.js";
import { DrizzleWalletRepository } from "../../App/Repository/Wallet/DrizzleWalletRepository.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { BrasilApiBusinessDayService } from "../../App/Service/WebService/BusinessDay/BrasilApiBusinessDayService.js";
import { BusinessDayService } from "../../App/Service/WebService/BusinessDay/BusinessDayService.js";
import { env } from "../Environment/env.js";
import { WalletRepository } from "../../App/Repository/Wallet/WalletRepository.js";
import { AppContainer } from "./AppContainer.js";

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
        container.register(WalletController, c => new WalletController(c.get(WalletManagementService)));

        // Business Day Service
        container.register(BusinessDayService, () => new BrasilApiBusinessDayService(env.HOLIDAYS_API_URL));

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
        container.register(TransactionController, c => new TransactionController(c.get(TransactionProcessorService)));

        // Middleware example
        container.register(AuthMockMiddleware, () => new AuthMockMiddleware());
    }
}