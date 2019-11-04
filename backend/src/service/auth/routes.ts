import { Request, Response } from "express";
import AuthController from "./AuthController";
import { checkSearchParams, checkJwt } from "../../middleware/checks";

export default [
  {
    path: "/api/v1/auth/login",
    method: "post",
    handler: [
      AuthController.login
    ]
  },
  {
    path: "/api/v1/auth/change-password",
    method: "post",
    handler: [
      checkJwt,
      AuthController.changePassword
    ]
  }
];
