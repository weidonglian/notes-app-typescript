import { Action } from 'redux'
import { Note, NoteVisibility, Todo } from '../models'

/// Types
export enum NotesActionTypes {
    ADD_NOTE,
    CHANGE_NOTE_VISIBILITY,

    ADD_TODO,
    TOGGLE_TODO
}

/// Actions
export interface AddNoteAction extends Action {
    type: NotesActionTypes.ADD_NOTE,
    payload: {
        note: Note
    }
}

export interface ChangeNoteVisibilityAction extends Action {
    type: NotesActionTypes.CHANGE_NOTE_VISIBILITY,
    payload: {
        id: number,
        visibility: NoteVisibility
    }
}

export interface AddTodoAction extends Action {
    type: NotesActionTypes.ADD_TODO,
    payload: {
        noteId: number,
        todo: Todo
    }
}

export interface ToggleTodoAction extends Action {
    type: NotesActionTypes.TOGGLE_TODO,
    payload: {
        noteId: number,
        todoId: number
    }
}

export type NotesAction = AddNoteAction | ChangeNoteVisibilityAction | AddTodoAction | ToggleTodoAction

/// Action creators

/** In order to automatically generate the action id. */
let nextNoteId = 0

export const addNote = (name: string): AddNoteAction => {
    return {
        type: NotesActionTypes.ADD_NOTE,
        payload: {
            note: {
                id: nextNoteId++,
                name: name,
                visibility: NoteVisibility.DEFAULT,
                todos: []
            }
        }
    }
}

export const changeNoteVisibility = (id: number, visibility: NoteVisibility): ChangeNoteVisibilityAction => {
    return {
        type: NotesActionTypes.CHANGE_NOTE_VISIBILITY,
        payload: {
            id, visibility
        }
    }
}

/** Automatic generate todo id */
let nextTodoId = 0

export const addTodo = (noteId: number, name: string): AddTodoAction => {
    return {
        type: NotesActionTypes.ADD_TODO,
        payload: {
            noteId,
            todo: {
                id: nextTodoId++,
                name: name,
                done: false
            }
        }
    }
}

export const toggleTodo = (noteId: number, todoId: number): ToggleTodoAction => {
    return {
        type: NotesActionTypes.TOGGLE_TODO,
        payload: {
            noteId, todoId
        }
    }
}