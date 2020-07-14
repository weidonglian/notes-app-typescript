import { IResolvers } from 'apollo-server-express'
import { checkJwtQL } from '../validator'
import { getUserIdFromRequestQL } from '../util/user'
import { GraphQLContext } from '.'

export const resolvers: IResolvers | Array<IResolvers> = {
    Query: {
        notes: async (parent, args, ctx: GraphQLContext) => {
            checkJwtQL(ctx)
            const userId = getUserIdFromRequestQL(ctx)
            const notes = await ctx.db.notes.getNoteTodoMap(userId)
            return notes
        }
    }
}