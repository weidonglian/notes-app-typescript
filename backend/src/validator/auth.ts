import { Request, Response, NextFunction } from "express";
import handleChecks from '../util/handleChecks';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  handleChecks.checkJwt(req, res, next)
}
// we must have done the checkJwt first and then check the role
export const checkRole = (roles: Array<string>) => {
  return handleChecks.checkRole(roles)
}