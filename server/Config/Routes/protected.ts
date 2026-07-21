import { FastifyPluginAsync, FastifyRouterOptions } from "fastify";
import { DrizzleTransactionRepository } from "../../App/Repository/Transaction/DrizzleTransactionRepository.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { DrizzleWalletRepository } from "../../App/Repository/Wallet/DrizzleWalletRepository.js";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";

const walletRepository = new DrizzleWalletRepository();
const transactionRepository = new DrizzleTransactionRepository();
const transactionProcessorService = new TransactionProcessorService(transactionRepository, walletRepository);
const transactionController = new TransactionController(transactionProcessorService);

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {
    
    // TODO: Implement paymentByWalletId and get wallet information routes.

}