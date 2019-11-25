import { checkJwt, checkRole } from '../../validator'
import { UsersController } from './UsersController'

export default [
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
        method: 'patch',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UsersController.editUser
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
