import { FastifyPluginAsync } from "fastify";
import { DrizzleTransactionRepository } from "../../App/Repository/Transaction/DrizzleTransactionRepository.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { DrizzleWalletRepository } from "../../App/Repository/Wallet/DrizzleWalletRepository.js";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { BrasilApiBusinessDayService } from "../../App/Service/WebService/BrasilApiBusinessDayService.js";
import { env } from "../Environment/env.js";

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {

    const authMiddleware = app.container.get<AuthMockMiddleware>(AuthMockMiddleware);
    const walletController = app.container.get<WalletController>(WalletController);
    const transactionController = app.container.get<TransactionController>(TransactionController);
    
    app.addHook('onRequest', authMiddleware.authenticate);

    app.get('/wallets/:id', walletController.getWallet);

    app.post('/transactions', transactionController.transactionByWalletId);
}