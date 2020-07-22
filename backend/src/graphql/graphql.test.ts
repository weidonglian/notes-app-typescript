import axiosist from 'axiosist'
import { testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions } from '../testutil/testApp'
import { HttpStatusCode } from '../util/httpErrors'
import { AxiosRequestConfig } from 'axios'
import { makeGraphQLTestClient } from '../testutil/testGraphQL'

describe('query notes', () => {
    let app: TestAppWithTokens
    let authOptions: AxiosRequestConfig
    let adminAuthOptions: AxiosRequestConfig

    beforeAll(async () => {
        app = await testAppWithLoginTestUser()
        authOptions = makeAuthHeaderOptions(app.testUserToken)
        adminAuthOptions = makeAuthHeaderOptions(app.adminUserToken)
    })

    afterAll(async () => {
        await testAppShutdown(app)
    })
    test('with valid user and password', async () => {
        // make a test client for graphql query and mutation
        const { query, mutate } = makeGraphQLTestClient(app, authOptions)

        // get notes
        const getNotes = `query {
          notes {
            id
            name
            todos {
              id
              name
              done
              noteId
            }
          }
        }`
        //
        const respQueryNotes = await query({
            query: getNotes
        })
        expect(respQueryNotes.errors).toBeUndefined()
        expect(respQueryNotes.data).toHaveProperty('notes', [])

        // now we add notes and todo
        const createNote = `mutate {
            createNote(name: "note1") {
                id
                name
                userId
                todos {
                  id
                  name
                  done
                }
            }
        }`
        const respCreateNote = await mutate({
            mutation: createNote
        })
    })
})
