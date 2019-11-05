import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const sqliteOrmConfig: SqliteConnectionOptions  = {
    "type": "sqlite",
    "database": "database.sqlite",
    "synchronize": true,
    "logging": false,
    "entities": [
       "dist/entity/**/*.js"
    ],
    "migrations": [
       "dist/migration/**/*.js"
    ],
    "subscribers": [
       "dist/subscriber/**/*.js"
    ],
    "cli": {
       "entitiesDir": "dist/entity",
       "migrationsDir": "dist/migration",
       "subscribersDir": "dist/subscriber"
    }
 }

