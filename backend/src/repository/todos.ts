import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
import { Todo } from '../model';

interface DbTodo {
    todo_id: number
    todo_name: string
    todo_done: boolean
    note_id: number
}

const tfTodo = (e: DbTodo): Todo => {
    let t = new Todo()
    t.id = e.todo_id
    t.name = e.todo_name
    t.done = e.todo_done
    t.noteId = e.note_id
    return t
}

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

    // Removes all records from the table;
    async clear(): Promise<null> {
        return this.db.none('TRUNCATE TABLE todos CASCADE');
    }

    // Adds a new todo, and returns the new object;
    async add(todo: Todo): Promise<Todo> {
        return this.db.one(`
            INSERT INTO todos (todo_name, todo_done, note_id)
            VALUES($1, $2, $3)
            RETURNING *
        `, [todo.name, todo.done, todo.noteId], tfTodo);
    }

    async update(todoId: number, name: string, done: boolean): Promise<Todo> {
        return this.db.one(`UPDATE todos SET todo_name=$1 todo_done=$2 WHERE todo_id=$3`, [name, done, todoId], tfTodo)
    }

    async toggle_done(todoId: number): Promise<Todo> {
        return this.db.one(`UPDATE todos SET todo_done=!todo_done WHERE todo_id=$1`, [todoId], tfTodo)
    }

    // Tries to delete a todo by id, and returns the number of records deleted;
    async remove(id: number): Promise<number> {
        return this.db.result('DELETE FROM todos WHERE todo_id = $1', +id, (r: IResult) => r.rowCount);
    }

    // Tries to find a todo from id;
    async findById(id: number): Promise<Todo | null> {
        return this.db.oneOrNone('SELECT * FROM todos WHERE todo_id = $1', +id, tfTodo);
    }

    // Tries to find a todo from id;
    async findByNoteId(noteId: number): Promise<Todo[]> {
        return this.db.any('SELECT * FROM todos WHERE note_id = $1', +noteId);
    }

    // Tries to find a todo from name;
    async findByName(name: string): Promise<Todo | null> {
        return this.db.oneOrNone('SELECT * FROM todos WHERE todo_name = $1', name, tfTodo);
    }

    // Returns all todo records;
    async all(): Promise<Todo[]> {
        return this.db.any('SELECT * FROM todos');
    }

    // Returns the total number of todos;
    async total(): Promise<number> {
        return this.db.one('SELECT count(*) FROM todos', [], (a: { count: string }) => +a.count);
    }
}