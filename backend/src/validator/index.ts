import { NextFunction, Request, Response } from 'express'
import handleChecks from '../util/handleChecks'
import { Validator } from 'class-validator'
import { HttpErrorBadRequest } from '../util/httpErrors'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    handleChecks.checkJwt(req, res, next)
}
// we must have done the checkJwt first and then check the role
export const checkRole = (roles: Array<string>) => {
    return handleChecks.checkRole(roles)
}

export const classValidator = new Validator()

export const checkNotEmpty = (obj: unknown, message: string) => {
    if (classValidator.isEmpty(obj))
        throw new HttpErrorBadRequest(message)
}