declare module "model-graph" {
    
    export interface DataStore {

    }

    export interface Datascheme {

    }
    
    export interface MiddlewareParams {
        dispatchAction: any;
        datascheme: Datascheme;
    }
    export function reduxMiddleware(params: MiddlewareParams)

    interface IDataScheme { 
        new(): IDataScheme;

    }
    export function DataScheme(scheme: object, options: object);
}