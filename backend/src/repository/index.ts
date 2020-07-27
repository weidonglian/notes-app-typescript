import { UsersRepository } from './users';
import { NotesRepository } from './notes';
import { TodosRepository } from './todos';

// Database Interface Extensions:
interface IExtensions {
    users: UsersRepository
    notes: NotesRepository
    todos: TodosRepository
}

export {
    IExtensions,
    UsersRepository,
    NotesRepository,
    TodosRepository
}