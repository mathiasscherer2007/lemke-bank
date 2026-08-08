import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { AppContainer } from "../../Config/Provider/AppContainer.js";
import { WalletController } from "../../App/Http/Controller/WalletController.js";
import { TransactionController } from "../../App/Http/Controller/TransactionController.js";
import { WalletManagementService } from "../../App/Service/WalletManagementService.js";
import { TransactionProcessorService } from "../../App/Service/TransactionProcessorService.js";
import { BrasilApiBusinessDayService } from "../../App/Service/WebService/BusinessDay/BrasilApiBusinessDayService.js"
import { AuthMockMiddleware } from "../../App/Http/Middleware/AuthMockMiddleware.js";
import { AppServiceProvider } from "../../Config/Provider/AppServiceProvider.js";

describe("AppServiceProvider", () => {
    test("boot registers the required providers and resolves WalletController with injected WalletManagementService", async () => {
        const container = new AppContainer();
        AppServiceProvider.boot(container);

        const walletController = container.get(WalletController);
        assert.ok(walletController instanceof WalletController);

        const walletService = walletController["service"];
        assert.ok(walletService instanceof WalletManagementService);

        const walletRepository = walletService["repository"];
        assert.strictEqual(walletRepository.constructor.name, "DrizzleWalletRepository");
    });

    test("boot registers the required providers and resolves TransactionController with injected TransactionProcessorService", async () => {
        const container = new AppContainer();
        AppServiceProvider.boot(container);

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
        const container = new AppContainer();
        AppServiceProvider.boot(container);

        const firstController = container.get<WalletController>(WalletController);
        const secondController = container.get<WalletController>(WalletController);

        assert.notStrictEqual(firstController, secondController);
        assert.strictEqual(firstController["service"], secondController["service"]);
    });

    test("boot resolves AuthMockMiddleware successfully", async () => {
        const container = new AppContainer();
        AppServiceProvider.boot(container);

        const middleware = container.get(AuthMockMiddleware);
        assert.ok(middleware instanceof AuthMockMiddleware);
    });
});
