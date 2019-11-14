import { Request, Response, NextFunction } from "express";
import handleChecks from '../util/handleChecks';

export const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
  handleChecks.checkSearchParams(req, res, next)
}