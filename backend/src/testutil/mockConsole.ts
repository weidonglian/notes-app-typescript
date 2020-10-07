export const spyOnConsole = (noLog: boolean) => {
    const mocks = {
        log: jest.spyOn(global.console, 'log').mockImplementation(() => { }),
        error: jest.spyOn(global.console, 'error').mockImplementation(() => { }),
        warn: jest.spyOn(global.console, 'warn').mockImplementation(() => { }),
        info: jest.spyOn(global.console, 'info').mockImplementation(() => { }),
        debug: jest.spyOn(global.console, 'debug').mockImplementation(() => { })
    }

    return noLog ? mocks : undefined
}

export const restoreConsole = (consoleMock: ReturnType<typeof spyOnConsole>) => {
    consoleMock?.log.mockRestore()
    consoleMock?.error.mockRestore()
    consoleMock?.warn.mockRestore()
    consoleMock?.info.mockRestore()
    consoleMock?.debug.mockRestore()
}