import { Box, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import React from 'react'
import { Todo } from '../../models'

interface UiTodosListProps {
    todos: Todo[],
    toggleTodo: (todoId: number) => void
}

export const UiTodosList = ({ todos, toggleTodo }: UiTodosListProps) => {
    return (
        <Box p={0}>
            <FormGroup>
                {todos.map(todo => (
                    <FormControlLabel key={todo.id}
                                      control={<Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)}/>}
                                      label={todo.name}
                    />)
                )}
            </FormGroup>
        </Box>
    )
}