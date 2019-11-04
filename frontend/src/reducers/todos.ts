import { TodosAction, TodosActionTypes } from '../actions/todos';
import { Todo } from '../models';

/// state definition
export interface TodosState {
    todos: Todo[]
}

/// init state
export const initialTodosState: TodosState = {
    todos: []
}

/// reducer
export const todosReducer = (state: TodosState = initialTodosState, action: TodosAction): TodosState => {
    switch(action.type) {
        case TodosActionTypes.ADD_TODO: {
            const { todo } = action.payload
            return {
                ...state,
                todos: [...state.todos, todo]
            }
        }

        case TodosActionTypes.TOGGLE_TODO: {
            const { todoId } = action.payload
            return {
                ...state,
                todos: state.todos.map(todo => todo.id === todoId ? { ...todo, done: !todo.done} : todo)
            }
        }

        default:
            return state
    }
}