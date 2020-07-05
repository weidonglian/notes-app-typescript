import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../../model'
import { HttpStatusCode, HttpErrorBadRequest, HttpErrorNotFound } from '../../util/httpErrors'

export class UsersController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const userRepository = getRepository(User)
        const users = await userRepository.find({
            select: ['id', 'username', 'role'] //We dont want to send the passwords on response
        })

        //Send the users object
        res.send(users)
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = Number(req.params.id)

        //Get the user from database
        const userRepository = getRepository(User)
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ['id', 'username', 'role'] //We dont want to send the password on response
            })
            res.send(user)
        } catch (error) {
            throw new HttpErrorNotFound('User not found')
        }
    }

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { username, password, role } = req.body
        let user = new User()
        user.username = username
        user.password = password
        user.role = role

        //Validade if the parameters are ok
        const errors = await validate(user)
        if (errors.length > 0) {
            throw new HttpErrorBadRequest(errors)
        }

        //Hash the password, to securely store on DB
        user.hashPassword()

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User)
        try {
            await userRepository.save(user)
        } catch (e) {
            throw new HttpErrorBadRequest('username already in use')
        }

        //If all ok, send 201 response
        res.status(HttpStatusCode.Success).send({
            id: user.id,
            username: user.username
        })
    }

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id

        //Get values from the body
        const { username, role } = req.body

        //Try to find user on database
        const userRepository = getRepository(User)
        let user
        try {
            user = await userRepository.findOneOrFail(id)
        } catch (error) {
            //If not found, send a 404 response
            throw new HttpErrorNotFound('User not found')
        }

        //Validate the new values on model
        user.username = username
        user.role = role
        const errors = await validate(user)
        if (errors.length > 0) {
            throw new HttpErrorBadRequest(errors)
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user)
        } catch (e) {
            throw new HttpErrorBadRequest('username already in use')
        }
        //After all send a 204 (no content, but accepted) response
        const { password, ...allowedUser } = user
        res.status(HttpStatusCode.Success).send(allowedUser)
    }

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id

        const userRepository = getRepository(User)
        let user: User
        try {
            user = await userRepository.findOneOrFail(id)
        } catch (error) {
            throw new HttpErrorNotFound('User not found')
        }

        userRepository.delete(id)
        res.status(HttpStatusCode.Success).send()
    }
}