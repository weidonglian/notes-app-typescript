import { Request, Response } from 'express'
import { HttpClientError } from './httpErrors'
import { getRepository } from 'typeorm'
import { User } from '../model'

export const getUserFromRequest = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId
    if (!id) {
        throw new Error('undefined res.locals.jwtPayload.userId')
    }
    //Get user from the database
    const userRepository = getRepository(User)
    return userRepository.findOneOrFail(id)
}