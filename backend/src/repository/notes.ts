import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { Note } from '../model';

interface DbNote {
    note_id: number
    note_name: string
    user_id: number
}

const tfNote = (e: DbNote) => {
    let t = new Note()
    t.id = e.note_id
    t.name = e.note_name
    t.userId = e.user_id
    return t
}

const tfNoteNullable = (e: DbNote) => {
    return e ? tfNote(e) : null
}

const mapNote = (row: any, index: number, data: DbNote[]) => {
    return tfNote(data[index])
}


/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/
export class NotesRepository {

    /**
     * @param db
     * Automated database connection context/interface.
     *
     * If you ever need to access other repositories from this one,
     * you will have to replace type 'IDatabase<any>' with 'any'.
     *
     * @param pgp
     * Library's root, if ever needed, like to access 'helpers'
     * or other namespaces available from the root.
     */
    constructor(private db: IDatabase<any>, private pgp: IMain) {
        /*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE notes CASCADE')
    }

    // Adds a new notes, and returns the new object;
    async add(note: Note): Promise<Note> {
        return this.db.one(`
            INSERT INTO notes (note_name, user_id)
            VALUES($1)
            RETURNING *
        `, [note.name, note.userId], tfNote);
    }

    async updateById(noteId: number, name: string): Promise<Note> {
        return this.db.one(`UPDATE notes SET note_name=$1 WHERE note_id=$2 RETURNING *`, [name, noteId], tfNote)
    }

    async getNoteTodoMap(userId: number): Promise<any> {
        return this.db.task(async t => {
            const notes = await t.map('SELECT * FROM notes WHERE user_id = $1', userId, mapNote)
            if (!notes || notes.length == 0) {
                return []
            }
            const fillTodos = (note: Note) => ({
                query: 'SELECT * FROM todos WHERE note_id = ${id}',
                values: note
            })
            const queries = this.pgp.helpers.concat(notes.map(fillTodos));
            const multiTodos = await t.multi(queries)
            notes.forEach((note: any, index: number) => {
                note.todos = multiTodos[index]
            })
            return notes;
        })
    }

    async findByUserId(userId: number): Promise<Note[]> {
        return this.db.map('SELECT * FROM notes WHERE user_id = $1', userId, mapNote)
    }

    // Tries to delete a notes by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM notes WHERE note_id = $1', +id, (r: IResult) => r.rowCount)
    }

    // Tries to find a notes from id;
    async findById(id: number): Promise<Note | null> {
        return this.db.oneOrNone('SELECT * FROM notes WHERE note_id = $1', +id, tfNoteNullable)
    }

    // Returns all notes records;
    async all(): Promise<Note[]> {
        return this.db.map('SELECT * FROM notes', [], mapNote)
    }

    // Returns the total number of notess;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM notes', [], (a: { count: string }) => +a.count)
    }
}