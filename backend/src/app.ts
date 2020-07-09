import express, { Application, Router } from 'express'
import http, { Server } from 'http'
import 'reflect-metadata'
import appConfig, { AppMode } from './config/config'
import { errorHandlers, middlewares } from './middleware'
import routes from './service'
import { applyMiddleware, applyRoutes } from './util'
import { ApolloServer, gql } from 'apollo-server-express';
import { dbmigrate } from './db'

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
}

const createGraphqlServer = (): ApolloServer => {
    // Construct a schema, using GraphQL schema language
    const typeDefs =
        `type Query {
    hello: String
  }`

    // Provide resolver functions for your schema fields
    const resolvers = {
        Query: {
            hello: () => 'Hello world!',
        },
    }

    return new ApolloServer({ typeDefs, resolvers, playground: true })
}

export const createApp = async (): Promise<App> => {
    const appExpress = express()
    const appGraphql = createGraphqlServer()
    applyMiddleware(middlewares, appExpress)
    applyRoutes(routes, appExpress, appConfig.routeBasePath)
    appGraphql.applyMiddleware({ app: appExpress })
    applyMiddleware(errorHandlers, appExpress)
    await dbmigrate.up() // dbmigration run here
    const { port, appMode } = appConfig
    const server = http.createServer(appExpress)
    return new Promise<App>((resolve: any, reject: any) => {
        try {
            server.listen(port, () => {
                console.log(`Server is running in '${appMode}' mode http://localhost:${port}${appGraphql.graphqlPath}`)
                resolve({
                    router: appExpress,
                    express: appExpress,
                    server: server
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}

export const shutdownApp = async (app: App) => {
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
