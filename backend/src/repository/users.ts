import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { User } from '../model';
import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'


/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/

export class UsersRepository {

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

    hashPassword(user: User) {
        user.password = bcrypt.hashSync(user.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, user: User): boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password)
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE users CASCADE');
    }

    // Adds a new user, and returns the new object;
    async add(username: string, password: string, role: string): Promise<User> {
        return this.db.one(`
            INSERT INTO users (username, password, role)
            VALUES($1, $2, $3)
            RETURNING *
        `, [username, password, role]);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM users WHERE id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a user from id;
    async findById(id: number): Promise<User | null> {
        return this.db.oneOrNone('SELECT * FROM users WHERE id = $1', +id);
    }

    // Tries to find a user from name;
    async findByName(name: string): Promise<User | null> {
        return this.db.oneOrNone('SELECT * FROM users WHERE name = $1', name);
    }

    // Returns all user records;
    async all(): Promise<User[]> {
        return this.db.any('SELECT * FROM users');
    }

    // Returns the total number of users;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM users', [], (a: { count: string }) => +a.count);
    }
}