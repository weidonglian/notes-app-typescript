import { IResolvers } from 'apollo-server-express'
import { checkJwtQL } from '../validator'
import { getUserIdFromRequestQL } from '../util/user'
import { GraphQLContext } from '.'
import { NoteModel } from '../model'
import { Resolvers } from './types'

export const resolvers: Resolvers<GraphQLContext> = {
    Query: {
        notes: async (_, __, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            const userId = getUserIdFromRequestQL(ctx)
            return await ctx.db.notes.getNoteTodoMap(userId)
        }
    },
    Mutation: {
        createNote: async (_, { name }, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            const input = new NoteModel
            input.name = name
            input.userId = getUserIdFromRequestQL(ctx)
            return await ctx.db.notes.add(input)
        },
        updateNote: async (_, { id, name }, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            return await ctx.db.notes.updateById(id, name)
        },
        deleteNote: async (_, { id }, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            return await ctx.db.notes.remove(id)
        }
    }
}