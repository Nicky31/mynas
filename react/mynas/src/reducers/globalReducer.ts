
import { ReduxActionType } from '../actions';

const initialState = {
    user: undefined,
    breadcrumb: []
};

export default function globalReducer (
    state: GlobalReducerShape = initialState,
    action: ActionShape<any>
) {
    switch (action.type) {
        case ReduxActionType.UPDATE_USER:
            const user: UpdateUserActionShape = action.value
            return ({ ...state, user })

        case ReduxActionType.PUSH_BREADCRUMB:
            const breadcrumb: PushBreadcrumbActionShape = action.value
            return ({...state, breadcrumb: [...state.breadcrumb, breadcrumb]})

        case ReduxActionType.POP_BREADCRUMB:
            const { index } : PopBreadcrumbActionShape = action.value || {}
            const sliceEnd = typeof index === 'undefined' ? state.breadcrumb.length - 1 : index + 1
            return ({...state, breadcrumb: state.breadcrumb.slice(0, sliceEnd)})

    }

	return state;
}