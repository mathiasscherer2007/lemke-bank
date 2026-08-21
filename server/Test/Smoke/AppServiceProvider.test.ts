import { strict as assert } from "node:assert";
import { beforeEach, describe, test } from "node:test";
import { AppContainer } from "../../Config/Provider/AppContainer.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { BrasilApiBusinessDayService } from "../../App/Service/WebService/BusinessDay/BrasilApiBusinessDayService.js"
import { AuthMiddleware } from "../../App/Http/Middleware/AuthMiddleware.js";
import { AppServiceProvider } from "../../Config/Provider/AppServiceProvider.js";

describe("AppServiceProvider", () => {
    let container: AppContainer;

    beforeEach(() => {
        container = new AppContainer();
        AppServiceProvider.boot(container);
    })

    test("boot registers the required providers and resolves WalletController with injected WalletManagementService", async () => {
        const walletController = container.get(WalletController);
        assert.ok(walletController instanceof WalletController);

        const walletService = walletController["walletManagementService"];
        assert.ok(walletService instanceof WalletManagementService);

        const walletRepository = walletService["walletStatement"];
        assert.strictEqual(walletRepository.constructor.name, "DrizzleWalletRepository");
    });

    test("boot registers the required providers and resolves TransactionController with injected TransactionProcessorService", async () => {
        const transactionController = container.get(TransactionController);
        assert.ok(transactionController instanceof TransactionController);

        const transactionProcessor = transactionController["transactionProcessorService"];
        assert.ok(transactionProcessor instanceof TransactionProcessorService);

        const transactionRepository = transactionProcessor["transactionRepository"];
        const walletRepository = transactionProcessor["walletRepository"];
        const businessDayService = transactionProcessor["businessDayService"];

        assert.strictEqual(transactionRepository.constructor.name, "DrizzleTransactionRepository");
        assert.strictEqual(walletRepository.constructor.name, "DrizzleWalletRepository");
        assert.ok(businessDayService instanceof BrasilApiBusinessDayService);
    });

    test("boot reuses singleton services across dependent controller resolutions", async () => {
        const firstController = container.get<WalletController>(WalletController);
        const secondController = container.get<WalletController>(WalletController);

        assert.notStrictEqual(firstController, secondController);
        assert.strictEqual(firstController["walletManagementService"], secondController["walletManagementService"]);
    });

    test("boot resolves AuthMiddleware successfully", async () => {
        const middleware = container.get(AuthMiddleware);
        assert.ok(middleware instanceof AuthMiddleware);
    });
});
