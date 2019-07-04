// Our custom data model structures
interface UserModelShape {
    email: string;
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
interface ActionShape<T> {
    type: ReduxActionType;
    value?: T;
    date: Date
}

type UpdateUserActionShape = UserModelShape

interface UpdateModelStoreActionShape {
    storeName: string;
    store: DataStore;
}

interface BreadcrumbShape {
    title: string;
    componentState: object; 
}

type PushBreadcrumbActionShape = BreadcrumbShape

interface PopBreadcrumbActionShape {
    index?: number;
}