import { Action, ActionCreator } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AppState } from '../reducers'
import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'

export type AC<A> = ActionCreator<A>
export type TkAction<R = Promise<void>> = ThunkAction<R, AppState, undefined, Action>
export type TkDispatch = ThunkDispatch<AppState, undefined, Action>


export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector