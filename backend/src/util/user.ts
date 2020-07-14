import { Request, Response } from 'express'
import { HttpClientError } from './httpErrors'
import { db } from '../db'
import { User } from '../model'
import { GraphQLContext } from '../graphql'

export const getUserFromRequest = async (req: Request, res: Response): Promise<User> => {
    const userId = getUserIdFromRequest(req, res);
    const user = await db.users.findById(userId)
    if (!user) {
        throw new Error(`can not find user with ${userId}`)
    }
    return user
}

export const getUserIdFromRequest = (req: Request, res: Response): number => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId
    if (!id) {
        throw new Error('undefined res.locals.jwtPayload.userId')
    }
    return id;
}

export const getUserIdFromRequestQL = (ctx: GraphQLContext): number => {
    return getUserIdFromRequest(ctx.req, ctx.res)
}