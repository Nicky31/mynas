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

    interface MiddlewareAction {
        fetch: () => Promise | any;
        outputStore: string; // Output in which result will be stored
        savePromise?: boolean; // If true, save/map promise result to callId param
        callId?: string; 
        autoGetter?: { // first tries to get the entry 'id' in the outputStore before fetch
            id: string;
        };
        groups?: string[]; // Link resulting entities to these groups
        quickInsert?: object; // Update outputStore with given object before fetch & update again with returned data
        action?: 'delete'; // Delete entity with id matching returned {id}
        endCallback?: ({ result, dispatch, getState } : {
            result: any;
            dispatch: any;
            getState: any;
        }) => any; // Callback called after stores updates (& before their dispatch)
    }
}