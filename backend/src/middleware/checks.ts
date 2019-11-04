import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { HTTP400Error } from "../utils/httpErrors";
import { User } from "../entity/User";

export const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.q) {
    throw new HTTP400Error("Missing q parameter");
  } else {
    next();
  }
};

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: "1h"
  });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};


export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
      //Check if array of authorized roles includes the user's role
      if (roles.indexOf(user.role) > -1) next();
      else res.status(401).send();
    } catch (id) {
      res.status(401).send();
    }
  };
};