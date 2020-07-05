import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { User } from '../model';
import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'


/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export class UserRepository {

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
            CREATE TABLE user(
                id serial PRIMARY KEY,
                name text NOT NULL
            )
        `)
    }

    // Initializes the table with some user records, and return their id-s;
    async init(): Promise<number[]> {
        // #todo
        const users = [
            {
                username: 'admin',
                password: 'admin',
                role: "ADMIN",
            },
            {
                username: 'dev',
                password: 'dev',
                role: "USER"
            },
            {
                username: 'test',
                password: 'test',
                role: "USER"
            }
        ]
        return this.db.map(`
            INSERT INTO user(name) VALUES
            ('Demo User 1'), -- user 1;
            ('Demo User 2'), -- user 2;
            ('Demo User 3'), -- user 3;
            ('Demo User 4'), -- user 4;
            ('Demo User 5') -- user 5;
            RETURNING id
        `, [], (row: { id: number }) => row.id);
    }

    hashPassword(user: User) {
        user.password = bcrypt.hashSync(user.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, user: User): boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password)
    }

    // Drops the table;
    async drop(): Promise<null> {
        return this.db.none('DROP TABLE user');
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE user CASCADE');
    }

    // Adds a new user, and returns the new object;
    async add(name: string): Promise<User> {
        return this.db.one(`
            INSERT INTO user(name)
            VALUES($1)
            RETURNING *
        `, name);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM user WHERE id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a user from id;
    async findById(id: number): Promise<User | null> {
        return this.db.oneOrNone('SELECT * FROM user WHERE id = $1', +id);
    }

    // Tries to find a user from name;
    async findByName(name: string): Promise<User | null> {
        return this.db.oneOrNone('SELECT * FROM user WHERE name = $1', name);
    }

    // Returns all user records;
    async all(): Promise<User[]> {
        return this.db.any('SELECT * FROM user');
    }

    // Returns the total number of users;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM user', [], (a: { count: string }) => +a.count);
    }
}