import { checkJwt } from '../../validator/auth'
import AuthController from './AuthController'

export default [
    {
        path: '/auth/ping',
        method: 'get',
        handler: [
            checkJwt,
            AuthController.ping
        ]
    },
    {
        path: '/auth/login',
        method: 'post',
        handler: [
            AuthController.login
        ]
    },
    {
        path: '/auth/password',
        method: 'post',
        handler: [
            checkJwt,
            AuthController.changePassword
        ]
    }
]
