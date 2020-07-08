import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { db } from '../../db'
import { User } from '../../model'
import { HttpStatusCode, HttpErrorBadRequest, HttpErrorNotFound, HttpErrorForbidden } from '../../util/httpErrors'

export class UsersController {

    static listAll = async (req: Request, res: Response) => {
        res.send(await db.users.all())
    }

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = Number(req.params.id)

        //Get the user from database
        const user = await db.users.findById(id)
        if (!user) {
            throw new HttpErrorNotFound('User not found')
        }
        res.send(user)
    }

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { username, password, role } = req.body
        let user = new User()
        user.name = username
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
        if (await db.users.findByName(user.name)) {
            throw new HttpErrorBadRequest('username already in use')
        }

        const savedUser = await db.users.add(user)
        //If all ok, send 201 response
        res.status(HttpStatusCode.Success).send({
            id: savedUser.id,
            username: savedUser.name
        })
    }

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id
        await db.users.remove(+id)
        res.status(HttpStatusCode.Success).send()
    }
}