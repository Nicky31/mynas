// Our custom data model structures
interface UserModelShape {
    name: string;
}

// Reducers 
interface StoresReducerShape {
    global: DataStore;
    users: DataStore;
    files: DataStore;
}

interface GlobalReducerShape {
    user?: UserModelShape;
    breadcrumb: BreadcrumbShape[];
}

// Redux action objects
interface UpdateModelStoreActionShape {
    storeName: string;
    store: DataStore;
}

interface BreadcrumbShape {
    title: string;
    componentState: object; 
}

interface PopBreadcrumbActionShape {
    index?: number;
}