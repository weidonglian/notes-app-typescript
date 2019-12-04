import axiosist from 'axiosist'
import { testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions } from '../../testutil/testApp'
import { HttpStatusCode } from '../../util/httpErrors'
import { AxiosRequestConfig } from 'axios'

describe('service /users GET', () => {
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

    test('GET /users invalid token', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/users', invalidAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Unauthorized)
    })

    test('GET /users valid token but admin', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/users', authOptions)
        expect(rsp.status).toBe(HttpStatusCode.Forbidden)
    })

    test('GET /users valid admin token', async () => {
        let rsp = await axiosist(app.express).get('/api/v1/users', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        const users = rsp.data
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        expect(users.length).toBeGreaterThanOrEqual(2)
    })

    test('GET /users/:id', async () => {
        let rsp = await axiosist(app.express)
            .get('/api/v1/users/1')
        expect(rsp.status).toBe(HttpStatusCode.Unauthorized)

        rsp = await axiosist(app.express).get('/api/v1/users/1', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        let user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'test')
        expect(user).toHaveProperty('role', 'USER')

        rsp = await axiosist(app.express).get('/api/v1/users/2', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'admin')
        expect(user).toHaveProperty('role', 'ADMIN')
    })
})

describe('service /users patch and delete', () => {
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

    test('PATCH /users', async () => {
        let rsp = await axiosist(app.express).patch('/api/v1/users/1', {
            username: 'newtest',
            role: 'ADMIN'
        }, adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        const user = rsp.data
        expect(user).toBeDefined()
        expect(user).toHaveProperty('username', 'newtest')
        expect(user).toHaveProperty('role', 'ADMIN')
    })

    test('DELETE /users', async () => {
        // before
        let rsp = await axiosist(app.express).get('/api/v1/users', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        let users = rsp.data
        //console.log(users)
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        const numOfUsersBefore = users.length

        // delete now
        rsp = await axiosist(app.express).delete('/api/v1/users/1', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)

        // after
        rsp = await axiosist(app.express).get('/api/v1/users', adminAuthOptions)
        expect(rsp.status).toBe(HttpStatusCode.Success)
        users = rsp.data
        //console.log(users)
        expect(users).toBeDefined()
        expect(Array.isArray(users)).toBe(true)
        const numOfUsersAfter = users.length
        expect(numOfUsersBefore-1).toEqual(numOfUsersAfter)
    })

})
