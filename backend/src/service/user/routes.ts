import { checkJwt, checkRole } from '../../validator/auth'
import UserController from './UserController'

export default [
    {
        path: '/user',
        method: 'get',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UserController.listAll
        ]
    },
    {
        path: '/user/:id([0-9]+)',
        method: 'get',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UserController.getOneById
        ]
    },
    {
        path: '/user/:id([0-9]+)',
        method: 'patch',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UserController.editUser
        ]
    },
    {
        path: '/user/:id([0-9]+)',
        method: 'delete',
        handler: [
            checkJwt,
            checkRole(['ADMIN']),
            UserController.deleteUser
        ]
    }
]
