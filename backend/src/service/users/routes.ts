import { checkJwt, checkRole } from '../../validator'
import { UsersController } from './UsersController'
import { Route } from '../../util'

const routes: Route[] = [
    {
        path: '/users',
        method: 'get',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UsersController.listAll
        ]
    },
    {
        path: '/users/:id([0-9]+)',
        method: 'get',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UsersController.getOneById
        ]
    },
    {
        path: '/users/:id([0-9]+)',
        method: 'delete',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UsersController.deleteUser
        ]
    }
]

export default routes