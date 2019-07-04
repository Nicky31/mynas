// Our custom data model structures
interface UserModelShape {
    email: string;
    name: string;
}

type FilePathShape = string[]

interface FileShape {
    id: string;
    filename: string;
    realPath: string;
    userPath: string;
    mime: string;
    size: number;
    updatedAt: string;
    directory: boolean;
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