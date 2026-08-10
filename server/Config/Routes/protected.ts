import { FastifyPluginAsync } from "fastify";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { AuthMiddleware } from "../../App/Http/Middleware/AuthMiddleware.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { StatementController } from "../../App/Http/Controller/StatementController.js";
import { getWalletParamsSchema, paymentByWalletIdDTO, chargeParamsSchema, createChargeDTO, statementQueryStringSchema } from "../../App/Dto/Request.js";
import { ChargeController } from "../../App/Http/Controller/ChargeController.js";

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {
    
    const authMiddleware = app.container.get<AuthMiddleware>(AuthMiddleware);
    app.addHook('onRequest', authMiddleware.authenticate);

    const walletController = app.container.get<WalletController>(WalletController);
    app.get('/wallets/:walletId', { schema: { params: getWalletParamsSchema } }, walletController.getWallet);

    const statementController = app.container.get<StatementController>(StatementController);
    app.get('/statement', { schema: { querystring: statementQueryStringSchema } }, statementController.getStatement);

    const transactionController = app.container.get<TransactionController>(TransactionController);
    app.post('/transactions', { schema: { body: paymentByWalletIdDTO } }, transactionController.transactionByWalletId);

    const chargeController = app.container.get<ChargeController>(ChargeController);
    app.get('/charges/:chargeId', { schema: { params: chargeParamsSchema } }, chargeController.getCharge);
    app.post('/charges/pay/:chargeId', { schema: { params: chargeParamsSchema } }, chargeController.payCharge);
    app.post('/charges', { schema: { body: createChargeDTO } }, chargeController.createCharge);
}