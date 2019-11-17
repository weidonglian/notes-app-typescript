
const tconsole = {
    log: (global as any).test_console.log,
    error: (global as any).test_console.error,
    warn: (global as any).test_console.warn,
    info: (global as any).test_console.info,
    debug: (global as any).test_console.debug
}

export default tconsole;