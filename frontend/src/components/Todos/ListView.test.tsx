import React from 'react';
import { TodosListView } from './ListView';
import { render } from '../../utils/test-utils'

describe('TodosListView', () => {
    test('should show the correct items', () => {
        const toggleTodoMock = jest.fn
        const todos = ['todo1', 'todo3', 'todo2'].map((item, index) => ({
            id: index,
            name: item,
            done: false
        }))
        const t = render(<TodosListView todos={todos} toggleTodo={toggleTodoMock} />)
        t.debug(t.container)
        expect(t.container).toHaveTextContent('todo1todo3todo2')
    });
})