import { connect } from 'react-redux';
import { AppState } from '../../reducers';
import { Dispatch } from 'redux';
import { getTodos } from '../../selectors/todos';
import { toggleTodo } from '../../actions/todos';
import { UiTodosList } from './UiList';

const mapStateToProps = (appState: AppState) => ({
    todos: getTodos(appState)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleTodo: (todoId: number) => dispatch(toggleTodo(todoId)),
});

export const TodosList = connect(
    mapStateToProps,
    mapDispatchToProps
)(UiTodosList)