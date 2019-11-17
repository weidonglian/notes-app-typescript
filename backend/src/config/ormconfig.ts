import { ConnectionOptions } from 'typeorm'
import { appConfig, AppMode } from './config'
import * as devOrmConfig from './ormconfig.dev'
import * as prodOrmConfig from './ormconfig.prod'
import * as testOrmConfig from './ormconfig.test'

const getOrmConfigFromAppMode = (appMode: AppMode): ConnectionOptions => {
    if (appMode === AppMode.Prod) {
        return prodOrmConfig as ConnectionOptions
    } else if (appMode === AppMode.Test) {
        return testOrmConfig as ConnectionOptions
    } else {
        return devOrmConfig as ConnectionOptions
    }
}

export default getOrmConfigFromAppMode(appConfig.appMode)
