import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { UserModel } from '../model';
import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'
import appConfig, { AppMode } from '../config/config';

interface DbUser {
    user_id: number
    user_name: string
    user_password: string
    user_role: string
}

const tfUser = (e: DbUser) => {
    let user = new UserModel()
    user.id = e.user_id
    user.username = e.user_name
    user.password = e.user_password
    user.role = e.user_role
    return user
}

const tfUserNullable = (e: DbUser) => {
    return e ? tfUser(e) : null
}

const mapUser = (row: any, index: number, data: DbUser[]) => {
    return tfUser(data[index])
}

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

    async init() {
        if (appConfig.appMode === AppMode.Dev) {
            const initUsers = [
                { username: 'admin', password: 'admin', isAdmin: true },
                { username: 'dev', password: 'dev', isAdmin: false },
                { username: 'test', password: 'test', isAdmin: false }
            ]
            for (const user of initUsers) {
                if (!await this.findByName(user.username)) {
                    this.addUser(user.username, user.password, user.isAdmin)
                }
            }
        }
    }

    async addUser(username: string, password: string, isAdmin: boolean) {
        let user = new UserModel
        user.username = username
        user.password = password
        user.hashPassword()
        user.role = isAdmin ? "ADMIN" : "USER"
        return this.add(user)
    }

    hashPassword(user: UserModel) {
        user.password = bcrypt.hashSync(user.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, user: UserModel): boolean {
        return bcrypt.compareSync(unencryptedPassword, user.password)
    }

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE users CASCADE');
    }

    // Adds a new user, and returns the new object;
    async add(user: UserModel): Promise<UserModel> {
        return this.db.one(`
            INSERT INTO users (user_name, user_password, user_role)
            VALUES($1, $2, $3)
            RETURNING *
        `, [user.username, user.password, user.role], tfUser);
    }

    async updatePassword(user: UserModel): Promise<number> {
        return this.db.one(`
            UPDATE users
            SET user_password=$1
            WHERE user_id=$2
            RETURNING user_id
        `, [user.password, user.id]);
    }
    // Tries to delete a user by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.one('DELETE FROM users WHERE user_id = $1 RETURNING user_id', +id);
    }

    // Tries to find a user from id;
    async findById(id: number): Promise<UserModel | null> {
        return this.db.oneOrNone('SELECT * FROM users WHERE user_id = $1', +id, tfUserNullable);
    }

    // Tries to find a user from name;
    async findByName(name: string): Promise<UserModel | null> {
        return this.db.oneOrNone('SELECT * FROM users WHERE user_name = $1', name, tfUserNullable);
    }

    // Returns all user records;
    async all(): Promise<UserModel[]> {
        return this.db.map('SELECT * FROM users', [], mapUser);
    }

    // Returns the total number of users;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM users', [], (a: { count: string }) => +a.count);
    }
}