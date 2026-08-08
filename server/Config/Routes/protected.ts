import { FastifyPluginAsync } from "fastify";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { StatementController } from "../Http/Controller/StatementController.js";

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {

    // TODO: This is just a example for now.
    const authMiddleware = app.container.get<AuthMockMiddleware>(AuthMockMiddleware);
    const walletController = app.container.get<WalletController>(WalletController);
    const transactionController = app.container.get<TransactionController>(TransactionController);
    const statementController = app.container.get<StatementController>(StatementController);
    
    app.addHook('onRequest', authMiddleware.authenticate);

    app.get('/wallets/:id', walletController.getWallet);

    app.get('/statement', statementController.getStatement);

    app.post('/transactions', transactionController.transactionByWalletId);


}