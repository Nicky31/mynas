import datascheme from 'lib/datascheme';
import { ReduxActionType } from 'actions';

const initialState = datascheme.allStores();

export default function usersReducer (state: StoresReducerShape = initialState, action: any) {
    switch (action.type) {
        case ReduxActionType.UPDATE_MODEL_STORE:
            const { store, storeName } = action as UpdateModelStoreActionShape
            return ({
                ...state,
                [storeName]: store
            })
    }

	return state;
}