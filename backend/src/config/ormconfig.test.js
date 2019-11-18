module.exports = {
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    synchronize: true,
    logging: false,
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
        "migrationsDir": "dist/migration",
        "subscribersDir": "dist/subscriber"
    }
}