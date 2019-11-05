import AuthController from "./AuthController";
import { checkJwt, checkRole } from "../../middleware/checks";
import UserController from "./UserController";

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
  },
  {
    path: "/api/v1/auth/users",
    method: "get",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.listAll
    ]
  },
  {
    path: "/api/v1/auth/user/:id([0-9]+)",
    method: "get",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.getOneById
    ]
  },
  {
    path: "/api/v1/auth/user/:id([0-9]+)",
    method: "patch",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.editUser
    ]
  },
  {
    path: "/api/v1/auth/user/:id([0-9]+)",
    method: "delete",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.deleteUser
    ]
  }
];
