import { TkDispatch } from '../utils/redux-utils'
import { apiClient } from '../utils/request-utils'
import { notesActions } from './notes'

const addNote = (name: string) => async (dispatch: TkDispatch) => {
    // first add it to server and then add to actual note
    const resp = await apiClient.post('/notes', { name })
    dispatch(notesActions.addNote(resp.data.id, resp.data.name))
}

const addTodo = (noteId: number, name: string) => async (dispatch: TkDispatch) => {
    const resp = await apiClient.post('/todos', { noteId, name })
    dispatch(notesActions.addTodo(resp.data.id, resp.data.noteId, resp.data.name))
}

const updateTodoName = (id: number, name: string) => async (dispatch: TkDispatch) => {
    const resp = await apiClient.put(`/todos/${id}`, { name })
    dispatch(notesActions.updateTodo(resp.data.todoId, resp.data.noteId, resp.data.done, resp.data.name))
}

const toggleTodo = (id: number) => async (dispatch: TkDispatch) => {
    const resp = await apiClient.put(`/todos/${id}/toggle_done`)
    dispatch(notesActions.updateTodo(resp.data.todoId, resp.data.noteId, resp.data.done, resp.data.name))
}

export const notesReqActions = {
    addNote,
    addTodo,
    updateTodoName,
    toggleTodo
}