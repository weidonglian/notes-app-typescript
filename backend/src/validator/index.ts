import { NextFunction, Request, Response } from 'express'
import handleChecks from '../util/handleChecks'
import { ValidatorOptions } from 'class-validator'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    handleChecks.checkJwt(req, res, next)
}
// we must have done the checkJwt first and then check the role
export const checkRole = (roles: Array<string>) => {
    return handleChecks.checkRole(roles)
}

export const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
    handleChecks.checkSearchParams(req, res, next)
}