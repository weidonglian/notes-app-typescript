import { validate } from 'class-validator'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { appConfig } from '../../config/config'

import { User } from '../../model'
import { HttpErrorBadRequest, HttpStatusCode } from '../../util/httpErrors'
import { getUserFromRequest } from '../../util/user'

class AuthController {
    static ping = async (req: Request, res: Response) => {
        res.status(HttpStatusCode.Success).send('hello')
    }

    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { username, password } = req.body
        if (!(username && password)) {
            throw new HttpErrorBadRequest('Unknown or empty username or password')
        }

        //Get user from database
        const userRepository = getRepository(User)
        let user: User
        try {
            user = await userRepository.findOneOrFail({ where: { username } })
        } catch (error) {
            throw new HttpErrorBadRequest('Unknown user:' + username)
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            throw new HttpErrorBadRequest('Bad password')
        }
        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username
            },
            appConfig.jwtSecret,
            {
                expiresIn: '4w' // 4 weeks
            }
        )

        //Send the jwt in the response
        res.send({
            token: token
        })
    }

    static signup = async (req: Request, res: Response) => {
        let { username, password } = req.body
        if (!(username && password)) {
            throw new HttpErrorBadRequest('Unkown or empty username or password')
        }

        const userRepository = getRepository(User)

        const count = await userRepository.count({
            username: username
        })

        if (count > 0) {
            throw new HttpErrorBadRequest('Already registered')
        }

        let user = new User()
        user.username = username
        user.password = password
        user.role = 'USER'
        user.hashPassword()
        user.notes = []
        //Validate de model (password lenght)
        const errors = await validate(user)
        if (errors.length > 0) {
            throw new HttpErrorBadRequest(errors)
        }
        await userRepository.save(user)
        res.status(HttpStatusCode.Success).send({
            id: user.id,
            username: user.username,
            role: user.role
        })
    }

    static changePassword = async (req: Request, res: Response) => {
        //Get parameters from the body
        const { oldPassword, newPassword } = req.body
        if (!(oldPassword && newPassword)) {
            throw new HttpErrorBadRequest('old or new password are empty')
        }

        const user = await getUserFromRequest(req, res)
        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            throw new HttpErrorBadRequest('old password is not matching to the new one')
        }

        //Validate de model (password lenght)
        user.password = newPassword
        const errors = await validate(user)
        if (errors.length > 0) {
            throw new HttpErrorBadRequest(errors)
        }
        //Hash the new password and save
        user.hashPassword()
        const userRepository = getRepository(User)
        userRepository.save(user)

        res.status(HttpStatusCode.Success).send()
    }
}

export default AuthController
