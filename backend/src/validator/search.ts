import { Request, Response, NextFunction } from "express";
import { doCheckSearchParams } from '../util/checks';

export const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
  doCheckSearchParams(req, res, next)
}