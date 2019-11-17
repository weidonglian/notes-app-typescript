module.exports = {
    type: "sqlite",
    database: "database.sqlite",
    synchronize: false,
    logging: true,
    entities: [
        "dist/entity/**/*.js"
    ],
    migrations: [
        "dist/migration/**/*.js"
    ],
    subscribers: [
        "dist/subscriber/**/*.js"
    ],
    cli: {
        "entitiesDir": "dist/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "dist/subscriber"
    }
}

