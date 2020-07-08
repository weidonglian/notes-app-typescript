import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { Note } from '../model';

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
        return this.db.none('TRUNCATE TABLE notes CASCADE');
    }

    // Adds a new notes, and returns the new object;
    async add(note: Note): Promise<Note> {
        return this.db.one(`
            INSERT INTO notes (note_name, user_id)
            VALUES($1)
            RETURNING *
        `, [note.name, note.userId]);
    }

    async updateById(noteId: number, name: string): Promise<Note> {
        return this.db.one(`UPDATE notes SET note_name=$1 WHERE note_id=$2 RETURNING *`, [name, noteId])
    }

    async findByUserId(userId: number): Promise<any> {
        return this.db.any(`SELECT * FROM notes NATURAL JOIN todos WHERE notes.user_id = $1`, userId)
    }

    // Tries to delete a notes by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM notes WHERE note_id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a notes from id;
    async findById(id: number): Promise<Note | null> {
        return this.db.oneOrNone('SELECT * FROM notes WHERE note_id = $1', +id);
    }

    // Returns all notes records;
    async all(): Promise<Note[]> {
        return this.db.any('SELECT * FROM notes');
    }

    // Returns the total number of notess;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM notes', [], (a: { count: string }) => +a.count);
    }
}