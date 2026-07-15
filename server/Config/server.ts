import { buildApp } from './app.js';
import { env } from './Environment/env.js';

const app = await buildApp({ logger: true });

app.listen({ port: env.API_PORT }, (err, adresss) => {
    if(err){
        app.log.error(err);
        process.exit(1);
    }
})