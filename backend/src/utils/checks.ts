import * as jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { HttpErrorBadRequest, HttpErrorUnauthorized, HttpErrorForbidden } from "./httpErrors";
import { User } from "../entity/User";

export const doCheckSearchParams = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.q) {
    throw new HttpErrorBadRequest("Missing q parameter");
  } else {
    next();
  }
};

export const doCheckJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head and Express headers are auto converted to lowercase
  let token = (req.headers['x-access-token'] || req.headers['authorization']) as string;
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  let jwtPayload;

  const jwtSecret = appConfig.jwtSecret
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    throw new HttpErrorUnauthorized();
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, jwtSecret, {
    expiresIn: "1h"
  });
  res.setHeader("auth-token", newToken);

  //Call the next middleware or controller
  next();
};

// we must have done the checkJwt first and then check the role
export const doCheckRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
      //Check if array of authorized roles includes the user's role
      if (roles.indexOf(user.role) > -1) {
        next();
      } else {
        throw new HttpErrorForbidden()
      }
    } catch (id) {
      throw new HttpErrorForbidden()
    }
  }
}