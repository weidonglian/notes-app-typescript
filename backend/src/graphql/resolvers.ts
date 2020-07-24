import { checkJwtQL } from '../validator'
import { getUserIdFromRequestQL } from '../util/user'
import { GraphQLContext } from '.'
import { NoteModel, TodoModel } from '../model'
import { Resolvers } from './types'

export const resolvers: Resolvers = {
    Query: {
        notes: async (_, __, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            const userId = getUserIdFromRequestQL(ctx)
            return await ctx.db.notes.findByUserId(userId)
        }
    },
    Node: {
        __resolveType() {
            return null
        }
    },
    Note: {
        id: n => n.id,
        name: n => n.name,
        userId: n => n.userId,
        todos: async (n, _, ctx) => await ctx.db.todos.findByNoteId(n.id)
    },
    Todo: {
        id: t => t.id,
        name: t => t.name,
        done: t => t.done,
        noteId: t => t.noteId
    },
    Mutation: {
        createNote: async (_, { name }, ctx) => {
            checkJwtQL(ctx)
            const input = new NoteModel
            input.name = name
            input.userId = getUserIdFromRequestQL(ctx)
            return await ctx.db.notes.add(input)
        },
        updateNote: async (_, { id, name }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.notes.updateById(id, name)
        },
        deleteNote: async (_, { id }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.notes.remove(id)
        },
        createTodo: async (_, { name, noteId }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.todos.add(name, false, noteId)
        },
        updateTodo: async (_, { id, name }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.todos.update(id, name)
        },
        deleteTodo: async (_, { id }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.todos.remove(id)
        },
        toggleTodo: async (_, { id }, ctx) => {
            checkJwtQL(ctx)
            return await ctx.db.todos.toggle_done(id)
        }
    }
}