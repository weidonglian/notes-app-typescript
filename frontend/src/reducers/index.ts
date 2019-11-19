import { combineReducers } from 'redux'
import { initialNotesState, notesReducer, NotesState } from './notes'

export interface AppState {
    notes: NotesState
}

export const initialAppState: AppState = {
    notes: initialNotesState
}

export const appReducer = combineReducers<AppState>({
    notes: notesReducer
})