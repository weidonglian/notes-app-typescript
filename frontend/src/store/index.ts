import logger from 'redux-logger';
import { createStore, applyMiddleware, Action } from 'redux';
import { AppState, appReducer, initialAppState } from '../reducers';

const store = createStore<AppState, Action, any, any>(
    appReducer, initialAppState, applyMiddleware(logger)
);

export default store;