import { ReduxActionType } from '../actions';

const initialState = {
    user: undefined,
    breadcrumb: []
};

export default function globalReducer (state: GlobalReducerShape = initialState, action: any) {
    var { type, ...params } = action

    switch (type) {
        case ReduxActionType.PUSH_BREADCRUMB:
            return ({...state, breadcrumb: [...state.breadcrumb, params]})

        case ReduxActionType.POP_BREADCRUMB:
            var sliceEnd = typeof params.index === 'undefined' ? state.breadcrumb.length - 1 : params.index + 1
            return ({...state, breadcrumb: state.breadcrumb.slice(0, sliceEnd)})

    }

	return state;
}