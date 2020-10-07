export const spyOnConsole = (noLog: boolean) => {
    const mocks = {
        log: jest.spyOn(global.console, 'log'),
        error: jest.spyOn(global.console, 'error'),
        warn: jest.spyOn(global.console, 'warn'),
        info: jest.spyOn(global.console, 'info'),
        debug: jest.spyOn(global.console, 'debug')
    }
    return noLog ? undefined : mocks
}

export const restoreConsole = (consoleMock: ReturnType<typeof spyOnConsole>) => {
    consoleMock?.log.mockRestore()
    consoleMock?.error.mockRestore()
    consoleMock?.warn.mockRestore()
    consoleMock?.info.mockRestore()
    consoleMock?.debug.mockRestore()
}