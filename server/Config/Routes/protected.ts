import { FastifyPluginAsync } from "fastify";
import { DrizzleTransactionRepository } from "../../App/Repository/Transaction/DrizzleTransactionRepository.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { DrizzleWalletRepository } from "../../App/Repository/Wallet/DrizzleWalletRepository.js";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";

const walletRepository = new DrizzleWalletRepository();
const walletManagementService = new WalletManagementService(walletRepository);
const walletController = new WalletController(walletManagementService);

const transactionRepository = new DrizzleTransactionRepository();
const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository);
const transactionController = new TransactionController(transactionProcessorService);

const authMiddleware = new AuthMockMiddleware(); // Mock to test feature.

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {
    
    app.addHook('onRequest', authMiddleware.authenticate);
    app.get('/wallets/:id', walletController.getWallet);
    app.post('/transactions', transactionController.transactionByWalletId);
}