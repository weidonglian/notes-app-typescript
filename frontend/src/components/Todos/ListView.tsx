import React from 'react';
import { Todo } from '../../models';
import { FormGroup, Typography, FormControlLabel, Checkbox } from '@material-ui/core';

interface TodosListViewProps {
    todos: Todo[],
    toggleTodo: (todoId: number) => void
}

export class TodosListView extends React.PureComponent<TodosListViewProps> {
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