import promise from 'bluebird' // best promise library today
import { dbConfig } from './config/config'
import pgPromise from 'pg-promise' // pg-promise core library
import { IInitOptions, IDatabase, IMain } from 'pg-promise'
import { IExtensions, UsersRepository } from './repository'

export type ExtendedProtocol = IDatabase<IExtensions> & IExtensions

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {

    // Using a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.users = new UsersRepository(obj, pgp)
    }
}

// Initializing the library:
export const pgp: IMain = pgPromise(initOptions)

// Creating the database instance with extensions:
export const db: ExtendedProtocol = pgp(dbConfig)
