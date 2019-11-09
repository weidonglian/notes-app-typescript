const { defaults } = require('jest-config')

module.exports = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testPathIgnorePatterns: [
        ...defaults.testPathIgnorePatterns,
        "<rootDir>/src/config/",
        "<rootDir>/dist/"
    ],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
}