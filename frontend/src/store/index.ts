import { Action, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import { appReducer, AppState, initialAppState } from '../reducers'


export const createStoreWith = (initialState: AppState) =>
    createStore<AppState, Action, any, any>(appReducer, initialState, applyMiddleware(logger))

export const store = createStoreWith(initialAppState)

export default store