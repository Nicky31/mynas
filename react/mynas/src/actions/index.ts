import { getStore } from 'lib/store';

class ReduxActionCreator<T={}> {
    history: T[];

    public constructor (public type: ReduxActionType) {
        this.history = [];

        this.create = this.create.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    public create(params?: T): T {
        if (params) {
            params = {...params, type: this.type}
        } else {
            params = {type: this.type} as any as T;
        }
        this.history.push({ ...params, __date: new Date() })
        return params;
    }

    public dispatch(params?: T) {
        return getStore().dispatch(this.create(params))
    }
}


// Redux action types
export enum ReduxActionType {
    // Global reducer
    UPDATE_MODEL_STORE,
    UPDATE_USER,
    PUSH_BREADCRUMB,
    POP_BREADCRUMB
}

export default class ReduxActions {
    static UPDATE_MODEL_STORE = new ReduxActionCreator<UpdateModelStoreActionShape>(ReduxActionType.UPDATE_MODEL_STORE)
    static UPDATE_USER = new ReduxActionCreator<UserModelShape>(ReduxActionType.UPDATE_USER)
    static PUSH_BREADCRUMB = new ReduxActionCreator<BreadcrumbShape>(ReduxActionType.PUSH_BREADCRUMB)
    static POP_BREADCRUMB = new ReduxActionCreator<PopBreadcrumbActionShape>(ReduxActionType.POP_BREADCRUMB)
}