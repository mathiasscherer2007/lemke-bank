import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { env } from '../Config/Environment/env.js';
import { loadTestDatabaseConfigurations } from '../Config/Database/connection.js';
import { execSync } from 'node:child_process';

export class Testcontainer 
{    
    public static async upTestDatabaseContainer()
    {
        const container = await new GenericContainer('mysql:latest')
        .withEnvironment({
            MYSQL_DATABASE: env.DB_NAME,
            MYSQL_USER: env.DB_USER,
            MYSQL_PASSWORD: env.DB_PASSWORD!,
            MYSQL_ROOT_PASSWORD: env.DB_PASSWORD!
        })
        .withExposedPorts(3306)
        .withWaitStrategy(Wait.forListeningPorts())
        .start();

        const mappedPort = container.getMappedPort(3306);
        loadTestDatabaseConfigurations(mappedPort);
        
        // Run migrations with the test container's port
        const env_vars = {
            ...process.env,
            DB_PORT: String(mappedPort)
        };
        execSync("npm run database:migrate", { 
            env: env_vars,
            stdio: 'inherit' 
        });

        return container;
    }

    public static async downTestDatabaseContainer(container: StartedTestContainer)
    {
        await container.stop({ remove: true });
    }

    public static async upTestRedisContainer()
    {
        const container = await new GenericContainer('redis:latest')
        .withEnvironment({
            REDIS_PASSWORD: env.REDIS_PASSWORD!
        })
        .withExposedPorts(6379)
        .withWaitStrategy(Wait.forListeningPorts())
        .start();

        const mappedPort = container.getMappedPort(6379);
        process.env.REDIS_HOST = '127.0.0.1';
        process.env.REDIS_PORT = String(mappedPort);
        env.REDIS_PORT = mappedPort;

        return container;
    }

    public static async downTestRedisContainer(container: StartedTestContainer)
    {
        await container.stop({ remove: true });
    }

}