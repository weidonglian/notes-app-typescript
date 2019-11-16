import AuthController from "./AuthController";
import { checkJwt } from '../../validator/auth';

export default [
  {
    path: "/api/v1/auth/ping",
    method: "get",
    handler: [
      checkJwt,
      AuthController.ping
    ]
  },
  {
    path: "/api/v1/auth/login",
    method: "post",
    handler: [
      AuthController.login
    ]
  },
  {
    path: "/api/v1/auth/password",
    method: "post",
    handler: [
      checkJwt,
      AuthController.changePassword
    ]
  }
];
