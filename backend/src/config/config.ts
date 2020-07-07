import { IConnectionParameters } from 'pg-promise/typescript/pg-subset'
import dbMigration from './db-migration.json'

export enum AppMode {
    Dev = 'dev',
    Prod = 'prod',
    Test = 'test'
}

export interface AppConfig {
    appMode: AppMode
    port: Number
    routeBasePath: string
    jwtSecret: string
    openCageDataKey: string
}

const devConfig: AppConfig = {
    appMode: AppMode.Dev,
    port: 4000,
    routeBasePath: '/api/v1',
    jwtSecret: '@Development',
    openCageDataKey: 's'
}

const prodConfig: AppConfig = {
    appMode: AppMode.Prod,
    port: 3000,
    routeBasePath: '/api/v1',
    jwtSecret: '@eEux&U12io',
    openCageDataKey: ''
}

const testConfig: AppConfig = {
    appMode: AppMode.Test,
    port: 0,
    routeBasePath: '/api/v1',
    jwtSecret: '@Test',
    openCageDataKey: ''
}

const appConfigs = [devConfig, prodConfig, testConfig]

const getAppModeFromEnv = () => {
    if (process.env.APP_MODE === 'prod')
        return AppMode.Prod
    else if (process.env.APP_MODE === 'test')
        return AppMode.Test
    else
        return AppMode.Dev
}


let currentAppMode = getAppModeFromEnv()

const getAppConfig = (appMode: AppMode) => {
    for (const cfg of appConfigs) {
        if (cfg.appMode === appMode)
            return cfg
    }
    return devConfig
}

export const appConfig = getAppConfig(currentAppMode)

const dbDevConfig: IConnectionParameters = {
    host: dbMigration.dev.host,
    port: dbMigration.dev.port,
    database: dbMigration.dev.database,
    user: dbMigration.dev.user,
    password: dbMigration.dev.password
}

const dbProdConfig: IConnectionParameters = {
    host: dbMigration.prod.host,
    port: dbMigration.prod.port,
    database: dbMigration.prod.database,
    user: dbMigration.prod.user,
    password: dbMigration.prod.password
}

const dbTestConfig: IConnectionParameters = {
    //driver: 'sqlite3',
    //filename: ':memory:'
    host: dbMigration.test.host,
    port: dbMigration.test.port,
    database: dbMigration.test.database,
    user: dbMigration.test.user,
    password: dbMigration.test.password
}

const getDbConfigFromAppMode = (appMode: AppMode): IConnectionParameters => {
    if (appMode === AppMode.Prod) {
        return dbProdConfig
    } else if (appMode === AppMode.Test) {
        return dbTestConfig
    } else {
        return dbDevConfig
    }
}

export const dbConfig: IConnectionParameters = getDbConfigFromAppMode(currentAppMode)

export default appConfig