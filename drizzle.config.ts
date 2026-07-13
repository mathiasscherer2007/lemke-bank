import { defineConfig } from "drizzle-kit";
import { env } from "server/Config/Environment/env"

export default defineConfig({
    dialect: "mysql",
    schema: "./server/Config/Database/Schema",
    out: "./server/Config/Database/Migration",
    dbCredentials: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        database: env.DB_NAME,
        password: env.DB_PASSWORD
    }
})