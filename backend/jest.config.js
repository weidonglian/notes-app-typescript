const { defaults } = require('jest-config')

module.exports = {
    verbose: true,
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    testPathIgnorePatterns: [
        ...defaults.testPathIgnorePatterns,
        "<rootDir>/src/config/",
        "<rootDir>/dist/"
    ],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],

    //restoreMocks: true
}