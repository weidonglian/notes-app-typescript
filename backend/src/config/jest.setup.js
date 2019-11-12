global.console = {
    log: jest.fn(), // console.log are ignored in tests
    // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
    error: jest.fn, // console.error,
    warn: jest.fn, // console.warn,
    info: jest.fn, // console.info,
    debug: jest.fn // console.debug,
}