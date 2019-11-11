import { Request, Response, NextFunction } from "express";
import { doCheckJwt, doCheckRole } from '../utils/checks';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  doCheckJwt(req, res, next)
}
// we must have done the checkJwt first and then check the role
export const checkRole = (roles: Array<string>) => {
  return doCheckRole(roles)
}