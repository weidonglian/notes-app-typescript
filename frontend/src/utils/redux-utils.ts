import { Action, ActionCreator } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AppState } from '../reducers'

export type AC<A> = ActionCreator<A>
export type TkAction<R = Promise<void>> = ThunkAction<R, AppState, undefined, Action>
export type TkDispatch = ThunkDispatch<AppState, undefined, Action>