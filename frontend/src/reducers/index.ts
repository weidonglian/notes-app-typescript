import { combineReducers } from 'redux'
import { initialNotesState, notesReducer, NotesState } from './notes'
import { MessageState, initialMessageState, messageReducer } from './message'

export interface AppState {
    notes: NotesState
    message: MessageState
}

export const initialAppState: AppState = {
    notes: initialNotesState,
    message: initialMessageState
}

export const appReducer = combineReducers<AppState>({
    notes: notesReducer,
    message: messageReducer
})