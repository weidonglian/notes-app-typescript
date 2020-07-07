import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { Todo } from '../model';

/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export class TodosRepository {

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
            CREATE TABLE todo(
                id serial PRIMARY KEY,
                name text NOT NULL
            )
        `)
    }

    // Initializes the table with some todo records, and return their id-s;
    async init(): Promise<number[]> {
        return this.db.map(`
            INSERT INTO todo(name) VALUES
            ('Demo todo 1'), -- todo 1;
            ('Demo todo 2'), -- todo 2;
            ('Demo todo 3'), -- todo 3;
            ('Demo todo 4'), -- todo 4;
            ('Demo todo 5') -- todo 5;
            RETURNING id
        `, [], (row: { id: number }) => row.id);
    }

    // Drops the table;
    async drop(): Promise<null> {
        return this.db.none('DROP TABLE todo');
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE todo CASCADE');
    }

    // Adds a new todo, and returns the new object;
    async add(name: string): Promise<Todo> {
        return this.db.one(`
            INSERT INTO todo(name)
            VALUES($1)
            RETURNING *
        `, name);
    }

    // Tries to delete a todo by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM todo WHERE id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a todo from id;
    async findById(id: number): Promise<Todo | null> {
        return this.db.oneOrNone('SELECT * FROM todo WHERE id = $1', +id);
    }

    // Tries to find a todo from name;
    async findByName(name: string): Promise<Todo | null> {
        return this.db.oneOrNone('SELECT * FROM todo WHERE name = $1', name);
    }

    // Returns all todo records;
    async all(): Promise<Todo[]> {
        return this.db.any('SELECT * FROM todo');
    }

    // Returns the total number of todos;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM todo', [], (a: { count: string }) => +a.count);
    }
}