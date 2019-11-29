import { Route } from '../../util/index'
import { checkJwt } from '../../validator'
import { TodosController } from './TodosController'

const routes: Route[] = [
    {
        path: '/todos',
        method: 'post',
        handler: [
            checkJwt,
            TodosController.postTodos
        ]
    },
    {
        path: '/todos/:id([0-9]+)',
        method: 'put',
        handler: [
            checkJwt,
            TodosController.putTodos
        ]
    },
    {
        path: '/todos/:id([0-9]+)/toggle_done',
        method: 'put',
        handler: [
            checkJwt,
            TodosController.putTodosToggleTodo
        ]
    },
    {
        path: '/todos/:id([0-9]+)',
        method: 'delete',
        handler: [
            checkJwt,
            TodosController.deleteTodos
        ]
    }
]

export default routes