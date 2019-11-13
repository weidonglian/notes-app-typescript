import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../../entity/User";
import { appConfig } from "../../config/config";
import { HttpErrorBadRequest } from '../../util/httpErrors';

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      throw new HttpErrorBadRequest("unknown or empty username and password")
    }

    //Get user from database
    const userRepository = getRepository(User);
    const user: User = await userRepository.findOneOrFail({ where: { username } });
    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new HttpErrorBadRequest("Bad password")
    }
    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      appConfig.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      throw new HttpErrorBadRequest("old or new password are empty")
    }

    //Get user from the database
    const userRepository = getRepository(User);
    const user: User = await userRepository.findOneOrFail(id);
    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      throw new HttpErrorBadRequest("old password is not matching to the new one")
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpErrorBadRequest(errors);
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
