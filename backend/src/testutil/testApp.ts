import { spyOnConsole, restoreConsole } from './mockConsole'
import axiosist from 'axiosist'
import { App, createApp, shutdownApp } from '../app'
import appConfig, { AppMode } from '../config/config'
import { UserModel } from '../model'
import { db, dbmigrate } from '../db'
import { HttpStatusCode } from '../util/httpErrors'

const addUser = async (name: string, password: string, role: string) => {
    let user = new UserModel
    user.username = name
    user.password = password
    user.hashPassword()
    user.role = role
    try {
        await db.users.add(user)
    } catch (error) {
        console.log(`+++++===catching ${error}`)
    }
}

const loginUser = async (username: string, password: string, app: App) => {
    const resp = await axiosist(app.express).post('/api/v1/auth/login', {
        username: username,
        password: password
    })
    expect(resp.status).toBe(HttpStatusCode.Success)
    expect(resp.data.token).toBeDefined()
    return resp.data.token as string
}

export const makeAuthHeaderOptions = (token: string) => ({
    headers: {
        'Authorization': 'Bearer ' + token
    }
})

export interface TestApp extends App {
    consoleMock?: ReturnType<typeof spyOnConsole>
}

export const testAppWithTestUser = async (): Promise<TestApp> => {
    if (appConfig.appMode !== AppMode.Test) {
        console.error('test can only be run in APP_MODE: "test"')
        process.exit(1)
    }

    const consoleMock = spyOnConsole(true)
    const app = await createApp()
    await dbmigrate.reset()
    await dbmigrate.up()
    await addUser('test', 'test', 'USER')
    await addUser('admin', 'admin', 'ADMIN')
    return { ...app, consoleMock }
}

export interface TestAppWithTokens extends TestApp {
    testUserToken: string
    adminUserToken: string
}

export const testAppWithLoginTestUser = async (): Promise<TestAppWithTokens> => {
    const app = await testAppWithTestUser()
    const testUserToken = await loginUser('test', 'test', app)
    const adminUserToken = await loginUser('admin', 'admin', app)
    return { ...app, testUserToken, adminUserToken }
}

export const testAppShutdown = async (app: TestApp) => {
    if (app.consoleMock) {
        restoreConsole(app.consoleMock)
    }
    await shutdownApp(app)
}

export const getTestUserId = async () => {
    const testUser = await db.users.findByName('test')
    return testUser?.id
}