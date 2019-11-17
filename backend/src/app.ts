import express, { Application, Router } from 'express'
import { Server } from 'http'
import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import appConfig from './config/config'
import ormConfig from './config/ormconfig'
import { errorHandlers, middlewares } from './middleware'
import routes from './service'
import { applyMiddleware, applyRoutes } from './util'

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
    applyRoutes(routes, appExpress)
    applyMiddleware(errorHandlers, appExpress)
    const { port, appMode } = appConfig
    const serverExpress = appExpress.listen(port, () =>
        console.log(`Server is running in '${appMode}' mode http://localhost:${port}...`)
    )
    return {
        router: appExpress,
        express: appExpress,
        server: serverExpress,
        db: dbConnection
    }
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
