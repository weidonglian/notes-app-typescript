import supertest from 'supertest'
import { getRepository } from 'typeorm'
import { App, createApp, shutdownApp } from '../app'
import appConfig, { AppMode } from '../config/config'
import { User } from '../entity/User'
import { HttpStatusCode } from '../util/httpErrors'

const addUser = async (name: string, password: string, role: string) => {
    let user = new User
    user.username = name
    user.password = password
    user.hashPassword()
    user.role = role
    const userRepository = getRepository(User)
    await userRepository.save(user)
}

const loginUser = async (username: string, password: string, app: App) => {
    const resp = await supertest(app.router)
        .post('/api/v1/auth/login')
        .send({
            username: username,
            password: password
        })
    expect(resp.status).toBe(HttpStatusCode.Success)
    expect(resp.body.token).toBeDefined()
    return resp.body.token as string
}

export const testAppWithTestUser = async () => {
    if (appConfig.appMode !== AppMode.Test) {
        console.error('test can only be run in APP_MODE: "test"')
        process.exit(1)
    }
    const app = await createApp()
    await addUser('test', 'test', 'USER')
    await addUser('admin', 'admin', 'ADMIN')
    return app
}

export interface TestApp extends App {
    testUserToken: string
    adminUserToken: string
}

export const testAppWithLoginTestUser = async (): Promise<TestApp> => {
    const app = await testAppWithTestUser()
    const testUserToken = await loginUser('test', 'test', app)
    const adminUserToken = await loginUser('admin', 'admin', app)
    return { ...app, testUserToken, adminUserToken }
}

export const testAppShutdown = async (app: App) => {
    await shutdownApp(app)
}