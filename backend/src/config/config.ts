export enum AppMode {
    Dev = 'dev',
    Prod = 'prod',
    Test = 'test'
}

export interface AppConfig {
    appMode: AppMode
    port: Number
    jwtSecret: string
    openCageDataKey: string
}

const devConfig: AppConfig = {
    appMode: AppMode.Dev,
    port: 4000,
    jwtSecret: '@Development',
    openCageDataKey: 's'
}

const prodConfig: AppConfig = {
    appMode: AppMode.Prod,
    port: 3000,
    jwtSecret: '@eEux&U12io',
    openCageDataKey: ''
}

const testConfig: AppConfig = {
    appMode: AppMode.Test,
    port: 5000,
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

export default appConfig