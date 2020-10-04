import { NextFunction, Request, Response } from 'express'
import handleChecks from '../util/handleChecks'
import { isEmpty } from 'class-validator'
import { HttpErrorBadRequest } from '../util/httpErrors'
import { GraphQLContext } from '../graphql'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    handleChecks.checkJwt(req, res)
    next()
}

export const checkJwtQL = (ctx: GraphQLContext) => {
    handleChecks.checkJwt(ctx.req, ctx.res)
}

// we must have done the checkJwt first and then check the role
export const checkRole = (roles: Array<string>) => {
    return handleChecks.checkRole(roles)
}

export const checkNotEmpty = (obj: unknown, message: string) => {
    if (isEmpty(obj))
        throw new HttpErrorBadRequest(message)
}