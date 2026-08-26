import { buildApp } from './app.js';
import { env } from './Environment/env.js';

const app = await buildApp({ logger: true });

app.listen({ host: '0.0.0.0', port: env.API_PORT }, (err) => {
    if(err){
        app.log.error(err);
        process.exit(1);
    }
})
