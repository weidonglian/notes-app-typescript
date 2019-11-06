import {
  handleCors,
  handleHelmet,
  handleBodyRequestParsing,
  handleCompression
} from "./common";

import { handleAPIDocs } from "./apiDocs";
import { handle404Error, handleClientError, handleServerError } from "./errorHandlers"

// the order in the array matters
export const middlewares = [
  handleCors,
  handleHelmet,
  handleBodyRequestParsing,
  handleCompression,
  handleAPIDocs
];

// the order in the array matters
export const errorHandlers = [
  handle404Error,
  handleClientError,
  handleServerError
]
