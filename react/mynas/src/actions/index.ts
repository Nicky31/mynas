import { getStore } from 'lib/store';

class ReduxActionCreator<T={}> {
    history: ActionShape<T>[];

    public constructor (public type: ReduxActionType) {
        this.history = [];

        this.create = this.create.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    public create(value?: T): ActionShape<T> {
        var action: ActionShape<T> = {
            date: new Date(),
            value: value,
            type: this.type
        }
        this.history.push(action)
        return action;
    }

    public dispatch(value?: T) {
        return getStore().dispatch(this.create(value))
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