import { Action, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import { appReducer, AppState, initialAppState } from '../reducers'

export const createStoreWith = (initialState: AppState) =>
    createStore<AppState, Action, any, any>(appReducer, initialState, applyMiddleware(
        logger,
        thunk
    ))

export const store = createStoreWith(initialAppState)

export default store