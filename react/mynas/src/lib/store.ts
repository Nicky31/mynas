import { combineReducers, applyMiddleware, createStore as _createStore } from 'redux';
import thunk from 'redux-thunk';
import { reduxMiddleware } from 'model-graph';
import datascheme from 'lib/datascheme.js';
import globalReducer from 'reducers/globalReducer';
import storesReducer from 'reducers/storesReducer';
import { ReduxActionType } from 'actions';

export function createStore(initialState={}) {
	var rootReducer = combineReducers({
		global: globalReducer,
		stores: storesReducer
	});

    return _createStore(rootReducer, initialState, applyMiddleware(
		reduxMiddleware({
			dispatchAction: ReduxActionType.UPDATE_MODEL_STORE,
			datascheme
		}),
		thunk
	));
}

var store: any = undefined;
export function getStore() {
    if (!store) {
        store = createStore()
    }
    return store
}
