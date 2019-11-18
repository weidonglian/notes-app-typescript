import axiosist from 'axiosist'
import { testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions } from '../../testutil/testapp'
import { HttpStatusCode } from '../../util/httpErrors'
import { AxiosRequestConfig } from 'axios'

describe('service /user GET', () => {
    let app: TestAppWithTokens
    let authOptions: AxiosRequestConfig
    let adminAuthOptions: AxiosRequestConfig
    let invalidAuthOptions: AxiosRequestConfig = makeAuthHeaderOptions('invalid token')

    beforeAll(async () => {
        app = await testAppWithLoginTestUser()
        authOptions = makeAuthHeaderOptions(app.testUserToken)
        adminAuthOptions = makeAuthHeaderOptions(app.adminUserToken)
    })

    afterAll(async () => {
        await testAppShutdown(app)
    })

    test('GET /user invalid token', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/user', invalidAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Unauthorized)
    })

    test('GET /user valid token but admin', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/user', authOptions)
        expect(rsp.status).toBe(HttpStatusCode.Forbidden)
    })

    test('GET /user valid admin token', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/user', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        const users = rsp.data
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        expect(users.length).toBeGreaterThanOrEqual(2)
    })

    test('GET /user/:id', async () => {
        let rsp = await axiosist(app.express)
            .get('/api/v1/user/1')
        expect(rsp.status).toBe(HttpStatusCode.Unauthorized)

        rsp = await axiosist(app.express).get('/api/v1/user/1', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        let user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'test')
        expect(user).toHaveProperty('role', 'USER')

        rsp = await axiosist(app.express).get('/api/v1/user/2', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'admin')
        expect(user).toHaveProperty('role', 'ADMIN')
    })
})

describe('service /user patch and delete', () => {
    let app: TestAppWithTokens
    let authOptions: AxiosRequestConfig
    let adminAuthOptions: AxiosRequestConfig
    let invalidAuthOptions: AxiosRequestConfig = makeAuthHeaderOptions('invalid token')

    beforeEach(async () => {
        app = await testAppWithLoginTestUser()
        authOptions = makeAuthHeaderOptions(app.testUserToken)
        adminAuthOptions = makeAuthHeaderOptions(app.adminUserToken)
    })

    afterEach(async () => {
        await testAppShutdown(app)
    })

    test('PATCH /user', async () => {
        let rsp = await axiosist(app.express).patch('/api/v1/user/1', {
            username: 'newtest',
            role: 'ADMIN'
        }, adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        const user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'newtest')
        expect(user).toHaveProperty('role', 'ADMIN')
    })

    test('DELETE /user', async () => {
        // before
        let rsp = await axiosist(app.express).get('/api/v1/user', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        let users = rsp.data
        //console.log(users)
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        const numOfUsersBefore = users.length

        // delete now
        rsp = await axiosist(app.express).delete('/api/v1/user/1', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)

        // after
        rsp = await axiosist(app.express).get('/api/v1/user', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        users = rsp.data
        //console.log(users)
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        const numOfUsersAfter = users.length
        expect(numOfUsersBefore-1).toEqual(numOfUsersAfter)
    })

})
