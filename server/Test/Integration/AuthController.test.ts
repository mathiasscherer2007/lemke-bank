import { strict as assert } from "node:assert";
import { after, before, describe, test } from "node:test";
import { FastifyInstance } from "fastify";
import { buildApp } from "../../Config/app.js";
import { StartedTestContainer } from "testcontainers/build/test-container.js";
import { Testcontainer } from "../Testcontainer.js";
import { pool } from "../../Config/Database/connection.js";

describe("AuthController routes", () => {
    let app: FastifyInstance;
    let dbContainer: StartedTestContainer;
    let redisContainer: StartedTestContainer;

    before(async () => {
        dbContainer = await Testcontainer.upTestDatabaseContainer();
        redisContainer = await Testcontainer.upTestRedisContainer();

        app = await buildApp();
        await app.ready();
    });

    after(async () => {
        await pool.end();
        await app.close();
        await Testcontainer.downTestDatabaseContainer(dbContainer);
        await Testcontainer.downTestRedisContainer(redisContainer);
        process.exit(0);
    });

    test("POST /signup creates an account and returns authentication headers", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/signup",
            body: {
                username: "alice",
                email: "alice@example.com",
                password: "secret-password",
                confirmPassword: "secret-password",
            },
        });

        assert.strictEqual(response.statusCode, 201);
        assert.strictEqual(typeof response.headers["x-access-token"], "string");
        assert.strictEqual(typeof response.headers["x-refresh-token"], "string");
        assert.deepStrictEqual(Object.keys(response.json()).sort(), [
            "email",
            "id",
            "username",
        ]);
    });

    test("POST /signup rejects invalid payloads before creating an account", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/signup",
            body: {
                username: "ab",
                email: "not-an-email",
                password: "short",
                confirmPassword: "mismatch",
            },
        });

        assert.strictEqual(response.statusCode, 400);
    });

    test("POST /login returns authentication headers for valid credentials", async () => {
        await app.inject({
            method: "POST",
            url: "/signup",
            body: {
                username: "alice",
                email: "alice@example.com",
                password: "secret-password",
                confirmPassword: "secret-password",
            },
        });

        const response = await app.inject({
            method: "POST",
            url: "/login",
            body: {
                email: "alice@example.com",
                password: "secret-password",
            },
        });

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(typeof response.headers["x-access-token"], "string");
        assert.strictEqual(typeof response.headers["x-refresh-token"], "string");
        assert.deepStrictEqual(Object.keys(response.json()).sort(), [
            "createdAt",
            "email",
            "id",
            "updatedAt",
            "username",
        ]);
    });

    test("POST /login rejects malformed credentials", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/login",
            body: {
                email: "not-an-email",
                password: "short",
            },
        });

        assert.strictEqual(response.statusCode, 400);
    });

    test("POST /logout accepts an authenticated refresh token and blacklists it", async () => {
        const signupResponse = await app.inject({
            method: "POST",
            url: "/signup",
            body: {
                username: "john doe",
                email: "john.doe@example.com",
                password: "secret-password",
                confirmPassword: "secret-password",
            },
        });
        const refreshToken = signupResponse.headers["x-refresh-token"] as string;

        const response = await app.inject({
            method: "POST",
            url: "/logout",
            headers: { "x-refresh-token": refreshToken },
        });
        assert.strictEqual(response.statusCode, 204);
    });

    test("POST /logout rejects requests without a refresh token", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/logout",
        });

        assert.strictEqual(response.statusCode, 401);
    });
});