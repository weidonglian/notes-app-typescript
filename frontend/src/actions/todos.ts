import { Todo } from '../models'
import { Action } from 'redux'
/// Types
export enum TodosActionTypes {
    ADD_TODO = '[todos] ADD_TODO',
    TOGGLE_TODO = '[todos] TOGGLE_TODO'
}

/// Actions
export interface AddTodoAction extends Action {
    type: TodosActionTypes.ADD_TODO,
    payload: {
        todo: Todo
    }
}

export interface ToggleTodoAction extends Action {
    type: TodosActionTypes.TOGGLE_TODO,
    payload: {
        todoId: number
    }
}

export type TodosAction = AddTodoAction | ToggleTodoAction

/// Action creators

/** In order to automatically generate the action id. */
let nextId = 0

export const addTodo = (name: string): AddTodoAction => {
    return {
        type: TodosActionTypes.ADD_TODO,
        payload: {
            todo: {
                id: nextId++,
                name: name,
                done: false,
            }
        }
    }
}

export const toggleTodo = (todoId: number): ToggleTodoAction => {
    return {
        type: TodosActionTypes.TOGGLE_TODO,
        payload: {
            todoId: todoId
        }
    }
}