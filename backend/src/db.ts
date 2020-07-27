import promise from 'bluebird' // best promise library today
import { dbConfig, appConfig } from './config/config'
import pgPromise from 'pg-promise' // pg-promise core library
import { IInitOptions, IDatabase, IMain } from 'pg-promise'
import { IExtensions, UsersRepository, NotesRepository, TodosRepository } from './repository'
// first require the package
var DBMigrate = require('db-migrate');

// The next step is to get a new instance of DBMigrate
export const dbmigrate = DBMigrate.getInstance(true, {
    config: './config/db-migration.json',
    env: appConfig.appMode,
    cmdOptions: {
        'migrations-dir': './src/migration'
    }
});

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
        obj.notes = new NotesRepository(obj, pgp)
        obj.todos = new TodosRepository(obj, pgp)
    }
}

// Initializing the library:
export const pgp: IMain = pgPromise(initOptions)

// Creating the database instance with extensions:
export const db: ExtendedProtocol = pgp(dbConfig)