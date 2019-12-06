import { checkJwt } from '../../validator'
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
        path: '/auth/signup',
        method: 'post',
        handler: [
            AuthController.signup
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
