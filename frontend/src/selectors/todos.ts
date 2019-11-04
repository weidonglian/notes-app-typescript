import { AppState } from '../reducers';
import { createSelector } from 'reselect';
import { TodosState } from '../reducers/todos';

const getTodosState = (state: AppState): TodosState => state.todos;

export const getTodos = createSelector([getTodosState], s=>s.todos);