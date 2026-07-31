import { env } from "../../../Config/Environment/env.js"

 export abstract class Controller 
{
    protected readonly API_HOST = env.API_HOST
    protected readonly API_PORT = env.API_PORT
}