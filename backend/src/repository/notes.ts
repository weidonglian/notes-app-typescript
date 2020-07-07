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

    // Creates the table;
    async create(): Promise<null> {
        return this.db.none(`
            CREATE TABLE note(
                id serial PRIMARY KEY,
                name text NOT NULL
            )
        `)
    }

    // Initializes the table with some note records, and return their id-s;
    async init(): Promise<number[]> {
        return this.db.map(`
            INSERT INTO note(name) VALUES
            ('Demo note 1'), -- note 1;
            ('Demo note 2'), -- note 2;
            ('Demo note 3'), -- note 3;
            ('Demo note 4'), -- note 4;
            ('Demo note 5') -- note 5;
            RETURNING id
        `, [], (row: { id: number }) => row.id);
    }

    // Drops the table;
    async drop(): Promise<null> {
        return this.db.none('DROP TABLE note');
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE note CASCADE');
    }

    // Adds a new note, and returns the new object;
    async add(name: string): Promise<Note> {
        return this.db.one(`
            INSERT INTO note(name)
            VALUES($1)
            RETURNING *
        `, name);
    }

    // Tries to delete a note by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM note WHERE id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a note from id;
    async findById(id: number): Promise<Note | null> {
        return this.db.oneOrNone('SELECT * FROM note WHERE id = $1', +id);
    }

    // Tries to find a note from name;
    async findByName(name: string): Promise<Note | null> {
        return this.db.oneOrNone('SELECT * FROM note WHERE name = $1', name);
    }

    // Returns all note records;
    async all(): Promise<Note[]> {
        return this.db.any('SELECT * FROM note');
    }

    // Returns the total number of notes;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM note', [], (a: { count: string }) => +a.count);
    }
}