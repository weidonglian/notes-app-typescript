import { NextFunction, Request, Response } from 'express'
import { HttpClientError, HttpErrorNotFound, HttpStatusCode } from './httpErrors'

// Just throw the client side error unknowns requests
export const notFoundError = (req: Request, res: Response) => {
  throw new HttpErrorNotFound("Method not found.");
};

export const clientError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpClientError) {
    console.warn(err);
    res.status(err.statusCode).send(err.message);
  } else {
    next(err);
  }
};

export const serverError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (process.env.NODE_ENV === "production") {
    res.status(HttpStatusCode.InternalServerError).send("Internal Server Error");
  } else {
    res.status(HttpStatusCode.InternalServerError).send(err.stack);
  }
};
