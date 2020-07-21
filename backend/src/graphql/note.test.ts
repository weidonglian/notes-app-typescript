import axiosist from 'axiosist'
import { testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions } from '../testutil/testApp'
import { HttpStatusCode } from '../util/httpErrors'
import { AxiosRequestConfig } from 'axios'

describe('query notes', () => {
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
    test('with valid user and password', async () => {

    })
})
