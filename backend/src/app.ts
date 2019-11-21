import express, { Application, Router } from 'express'
import http, { Server } from 'http'
import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import appConfig from './config/config'
import ormConfig from './config/ormconfig'
import { errorHandlers, middlewares } from './middleware'
import routes from './service'
import { applyMiddleware, applyRoutes } from './util'
import { resolve } from 'dns'

process.on('uncaughtException', e => {
    console.log(e)
    process.exit(1)
})

process.on('unhandledRejection', e => {
    console.log(e)
    process.exit(1)

})

export interface App {
    router: Router
    express: Application
    server: Server
    db: Connection
}

export const createApp = async (): Promise<App> => {
    const dbConnection = await createConnection(ormConfig)
    const appExpress = express()
    applyMiddleware(middlewares, appExpress)
    applyRoutes(routes, appExpress, appConfig.routeBasePath)
    applyMiddleware(errorHandlers, appExpress)
    const { port, appMode } = appConfig
    const server = http.createServer(appExpress)
    return new Promise<App>((resolve: any, reject: any) => {
        try {
            server.listen(port, () => {
                console.log(`Server is running in '${appMode}' mode http://localhost:${port}...`)
                resolve({
                    router: appExpress,
                    express: appExpress,
                    server: server,
                    db: dbConnection
                })
            })
        } catch(error) {
            reject(error)
        }
    })
}

export const shutdownApp = async (app: App) => {
    await app.db.close()
    let closePromise = new Promise((resolve, reject) => {
        app.server.close(err => {
            if (err)
                reject(err)
            else
                resolve()
        })
    })
    await closePromise
}