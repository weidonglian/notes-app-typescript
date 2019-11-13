import UserController from "./UserController";
import { checkJwt, checkRole } from '../../validator/auth';

export default [
  {
    path: "/api/v1/users",
    method: "get",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.listAll
    ]
  },
  {
    path: "/api/v1/user/:id([0-9]+)",
    method: "get",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.getOneById
    ]
  },
  {
    path: "/api/v1/user/:id([0-9]+)",
    method: "patch",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.editUser
    ]
  },
  {
    path: "/api/v1/user/:id([0-9]+)",
    method: "delete",
    handler: [
      checkJwt,
      checkRole(["ADMIN"]),
      UserController.deleteUser
    ]
  }
];
