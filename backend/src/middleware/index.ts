import { handleAPIDocs } from './apiDocs'
import { handleBodyRequestParsing, handleCompression, handleCors, handleHelmet } from './common'
import { handle404Error, handleClientError, handleServerError } from './errorHandlers'

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
