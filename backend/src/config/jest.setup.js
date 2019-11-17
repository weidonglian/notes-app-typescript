// set the env APP_MODE for testing
process.env = Object.assign(process.env, {
    APP_MODE: 'test'
})

// Hijack the global console
var global_console = global.console

global.test_console = global_console

global.console = {
    log: jest.fn, // console.log are ignored in tests
    // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
    error: jest.fn, // console.error,
    warn: jest.fn, // console.warn,
    info: jest.fn, // console.info,
    debug: jest.fn // console.debug,
}