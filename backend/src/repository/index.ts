import { UserRepository } from './user';
import { NoteRepository } from './note';
import { TodoRepository } from './todo';

// Database Interface Extensions:
interface IExtensions {
    users: UserRepository
    notes: NoteRepository
    todos: TodoRepository
}

export {
    IExtensions,
    UserRepository,
    NoteRepository,
    TodoRepository
}