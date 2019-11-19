import { Action, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import { appReducer, AppState, initialAppState } from '../reducers'

const store = createStore<AppState, Action, any, any>(
    appReducer, initialAppState, applyMiddleware(logger)
)

export default store