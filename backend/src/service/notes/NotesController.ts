import { User } from '../../entity/User'
import { getRepository } from 'typeorm'
import { Response, Request } from 'express'
import { getUserFromRequest } from '../../util/user'

export class NotesController {
    static getNotes = async (req: Request, res: Response) => {
        //Get users from database
        const user = getUserFromRequest(req, res)
        //Send the users object
        res.send(user)
    }
}