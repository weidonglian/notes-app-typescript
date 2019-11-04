import React from 'react';
import { Todo } from '../../models';
import { FormGroup, Typography, FormControlLabel, Checkbox } from '@material-ui/core';

interface UiTodosListProps {
    todos: Todo[],
    toggleTodo: (todoId: number) => void
}

export class UiTodosList extends React.PureComponent<UiTodosListProps> {
    render() {
        const { todos, toggleTodo } = this.props;
        return (
            <div>
                {todos && todos.length > 0 ? (
                    <FormGroup>
                        {todos.map(todo => <FormControlLabel key={todo.id} label={todo.name} control={<Checkbox onChange={()=>toggleTodo(todo.id)} />} />)}
                    </FormGroup>
                ) : (
                    <Typography variant="body1">
                        Nothing has been planed, add your first todo now.
                    </Typography>
                )}
            </div>
        )
    }
}