import axiosist from 'axiosist'
import { testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions, getTestUserId } from '../../testutil/testApp'
import { HttpStatusCode } from '../../util/httpErrors'
import { AxiosRequestConfig } from 'axios'
import { NoteModel } from '../../model'
import { db } from '../../db'

describe('service /notes', () => {
    let app: TestAppWithTokens
    let authOptions: AxiosRequestConfig

    beforeEach(async () => {
        app = await testAppWithLoginTestUser()
        authOptions = makeAuthHeaderOptions(app.testUserToken)
    })

    afterEach(async () => {
        await testAppShutdown(app)
    })

    test('POST /notes', async () => {
        // before
        const userId = await getTestUserId()
        if (!userId) throw new Error('no test user')
        await db.notes.clearByUserId(userId)
        // before
        const noteNames = ['foo', 'bar'];
        for (let name of noteNames) {
            let rsp = await axiosist(app.express).post('/api/v1/notes', { name }, authOptions)
            expect(rsp.status).toBe(HttpStatusCode.Success)
            let note = rsp.data
            expect(note).toBeDefined()
            expect(note.name).toBe(name)
            expect(note.id).toBeDefined()
        }

        const notes = await db.notes.findByUserId(userId)
        expect(notes).toBeDefined()
        expect(notes.length).toBe(noteNames.length)
        for (let i in noteNames) {
            expect(notes[i].id).toBeDefined()
            expect(notes[i].name).toBe(noteNames[i])
        }
    })

    describe("GET and DELETE /notes", () => {

        const noteNames = ['foo', 'bar']
        let noteIds: number[] = []
        let userId: number | undefined

        beforeEach(async () => {
            // before
            userId = await getTestUserId()
            if (!userId) throw new Error('no test user')
            await db.notes.clearByUserId(userId)
            noteIds = []
            for (let name of noteNames) {
                const n = new NoteModel()
                n.name = name
                n.userId = userId
                const rn = await db.notes.add(n)
                noteIds.push(rn.id)
            }
        })

        test('GET /notes', async () => {
            let rsp = await axiosist(app.express).get('/api/v1/notes', authOptions)
            expect(rsp.status).toBe(HttpStatusCode.Success)
            let notes = rsp.data
            expect(notes).toBeDefined()
            expect(notes.length).toBe(noteNames.length)
            for (let i in noteNames) {
                expect(notes[i].id).toBeDefined()
                expect(notes[i].name).toBe(noteNames[i])
                expect(notes[i].userId).toBeDefined()
            }
        })

        test('DELETE /notes', async () => {
            for (let i in noteNames) {
                const id = noteIds[i]
                expect(id).toBeDefined()
                let rsp = await axiosist(app.express).delete(`/api/v1/notes/${id}`, authOptions)
                expect(rsp.status).toBe(HttpStatusCode.Success)
                expect(rsp.data.id).toBe(id)
                expect(rsp.data.name).toBe(noteNames[i])
            }
            const notes = await db.notes.findByUserId(userId as number)
            expect(notes).toBeDefined()
            expect(notes.length).toBe(0)
        })

    })

})
