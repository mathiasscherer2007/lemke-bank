import { ServiceProviderTokenNotFound } from "../../App/Exception/InfrastructureException.js";
import { Factory } from "../Types/provider.js";

export class AppContainer
{
    private factories = new Map<any, Factory<any>>();
    private singletons = new Map<any, any>();
    private instances = new Map<any, any>();

    /**
     * Registry a new application service.
     * 
     * @param token - Interface name for this service. Use class name if it doesn't has a abstraction.
     * @param factory - Method which will be responsable for instantiate this service.
     * @param isSingleton - Tell the AppContainer that the service will be a singleton.
     */
    public register<T>(token: any, factory: Factory<T>, isSingleton?: boolean): void
    {
        this.factories.set(token, factory);
        if(isSingleton) this.singletons.set(token, factory);
    }

    public get<T>(token: any): T
    {
        if(this.singletons.has(token) && this.instances.has(token)){
            return this.instances.get(token);
        }

        const factory = this.factories.get(token);
        if(!factory){
            throw new ServiceProviderTokenNotFound(token);
        }

        const service = factory(this);
        
        if(this.singletons.has(token)){
            this.instances.set(token, service);
        }

        return service;
    }
}