import { combineReducers } from 'redux';
import * as fromTodos from './todos';

export interface AppState {
    todos: fromTodos.TodosState
}

export const initialAppState: AppState = {
    todos: fromTodos.initialTodosState
}

export const appReducer = combineReducers<AppState>({
    todos: fromTodos.todosReducer
})