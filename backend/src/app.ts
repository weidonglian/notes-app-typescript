import express, { Application } from "express";
import "reflect-metadata";
import { createConnection, Connection } from 'typeorm';
import { applyMiddleware, applyRoutes } from "./utils";
import { middlewares, errorHandlers} from "./middleware";
import routes from "./service";
import appConfig from './config/config'
import ormConfig from './config/ormconfig'
import { Server } from 'http';

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});

export interface App {
  appExpress: Application
  serverExpress: Server
  dbConnection: Connection
}

export const createApp = async (): Promise<App> => {
  const dbConnection = await createConnection(ormConfig)
  const appExpress = express()
  applyMiddleware(middlewares, appExpress)
  applyRoutes(routes, appExpress)
  applyMiddleware(errorHandlers, appExpress)
  const { port, appMode } = appConfig
  const serverExpress = appExpress.listen(port, () =>
    console.log(`Server is running in '${appMode}' mode http://localhost:${port}...`)
  )
  return { appExpress, serverExpress, dbConnection }
}

export const shutdownApp = (app: App) => {
  app.dbConnection.close()
  app.serverExpress.close()
}
