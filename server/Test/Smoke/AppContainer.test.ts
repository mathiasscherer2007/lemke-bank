import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { AppContainer } from "../../Config/Provider/AppContainer.js";
import { ServiceProviderTokenNotFound } from "../../App/Exception/InfrastructureException.js";

class MockDependency {}

class DependentService {
    constructor(public readonly dependency: MockDependency) {}
}

async function loadAppServiceProvider() {
    process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
    process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? "test-password";
    process.env.HOLIDAYS_API_URL = process.env.HOLIDAYS_API_URL ?? "https://example.com";

    const module = await import("../../Config/Provider/AppServiceProvider.js");
    return module.AppServiceProvider;
}

describe("AppContainer", () => {
    test("resolves a registered service", () => {
        const container = new AppContainer();
        const instance = new MockDependency();

        container.register(MockDependency, () => instance);

        const resolved = container.get(MockDependency);
        assert.strictEqual(resolved, instance);
    });

    test("creates new instances for non-singleton services", () => {
        const container = new AppContainer();

        container.register(MockDependency, () => new MockDependency());

        const first = container.get(MockDependency);
        const second = container.get(MockDependency);

        assert.notStrictEqual(first, second);
    });

    test("returns the same instance for singleton services", () => {
        const container = new AppContainer();

        container.register(MockDependency, () => new MockDependency(), true);

        const first = container.get(MockDependency);
        const second = container.get(MockDependency);

        assert.strictEqual(first, second);
    });

    test("replaces a resolved singleton when its registration changes", () => {
        const container = new AppContainer();
        const firstInstance = new MockDependency();
        const replacementInstance = new MockDependency();

        container.register(MockDependency, () => firstInstance, true);
        assert.strictEqual(container.get(MockDependency), firstInstance);

        container.register(MockDependency, () => replacementInstance, true);
        assert.strictEqual(container.get(MockDependency), replacementInstance);
    });

    test("removes singleton caching when a token is re-registered as transient", () => {
        const container = new AppContainer();

        container.register(MockDependency, () => new MockDependency(), true);
        container.get(MockDependency);

        container.register(MockDependency, () => new MockDependency());
        assert.notStrictEqual(container.get(MockDependency), container.get(MockDependency));
    });

    test("injects dependencies using the container in factory callbacks", () => {
        const container = new AppContainer();

        container.register(MockDependency, () => new MockDependency(), true);
        container.register(DependentService, c => new DependentService(c.get(MockDependency)));

        const dependent = container.get(DependentService);

        assert.ok(dependent instanceof DependentService);
        assert.ok(dependent.dependency instanceof MockDependency);
    });

    test("throws ServiceProviderTokenNotFound when resolving an unregistered token", () => {
        const container = new AppContainer();

        assert.throws(
            () => container.get("missing-token"),
            ServiceProviderTokenNotFound
        );
    });
});
