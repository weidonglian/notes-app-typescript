module.exports = {
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [
        "src/entity/**/*.ts"
    ],
    cli: {
        "entitiesDir": "src/entity",
    }
}