import { Box, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import React from 'react'
import { Todo } from '../../models'

interface TodosListViewProps {
    todos: Todo[],
    toggleTodo: (todoId: number) => void
}

export const TodosListView = ({ todos, toggleTodo }: TodosListViewProps) => {
    return (
        <Box p={0}>
            <FormGroup>
                {todos.map(todo => (
                    <FormControlLabel key={todo.id} data-testid={'todos
                                      control={<Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)}/>}
                                      label={todo.name}
                    />)
                )}
            </FormGroup>
        </Box>
    )
}