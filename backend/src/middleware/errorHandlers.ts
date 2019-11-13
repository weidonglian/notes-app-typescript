import { Request, Response, NextFunction, Router } from "express";
import { notFoundError, clientError, serverError } from "../util/handleErrors";

export const handle404Error = (router: Router) => {
  // this will catch all the not found requests.
  router.use((req: Request, res: Response) => {
    notFoundError(req, res);
  });
};

export const handleClientError = (router: Router) => {
  // this will catch all errors with type HttpClientError
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    clientError(err, req, res, next);
  });
};

export const handleServerError = (router: Router) => {
  // this will be the last defense to catch errors, i.e. server side errors.
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    serverError(err, req, res, next);
  });
};
