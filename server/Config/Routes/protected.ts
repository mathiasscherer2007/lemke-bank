import { FastifyPluginAsync } from "fastify";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { StatementController } from "../../App/Http/Controller/StatementController.js";
import { getWalletParamsSchema, paymentByWalletIdDTO, chargeParamsSchema, createChargeDTO } from "../../App/Dto/Request.js";
import { ChargeController } from "../../App/Http/Controller/ChargeController.js";

export const protectedRoutes: FastifyPluginAsync = async (app, options) => {
    let schema;

    const authMiddleware = app.container.get<AuthMockMiddleware>(AuthMockMiddleware);
    app.addHook('onRequest', authMiddleware.authenticate);

    const walletController = app.container.get<WalletController>(WalletController);
    schema = {
        params: getWalletParamsSchema
    }
    app.get('/wallets/:walletId', { schema }, walletController.getWallet);

    const statementController = app.container.get<StatementController>(StatementController);
    app.get('/statement', statementController.getStatement);

    schema = {
        body: paymentByWalletIdDTO
    }
    const transactionController = app.container.get<TransactionController>(TransactionController);
    app.post('/transactions', { schema }, transactionController.transactionByWalletId);

    const chargeController = app.container.get<ChargeController>(ChargeController);
    schema = {
        params: chargeParamsSchema
    }
    app.get('/charges/:chargeId', { schema }, chargeController.getCharge);
    app.post('/charges/pay/:chargeId', { schema }, chargeController.payCharge);
    schema = {
        body: createChargeDTO 
    }
    app.post('/charges', { schema }, chargeController.createCharge);
    
}