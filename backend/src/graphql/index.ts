import { ApolloServer, gql } from 'apollo-server-express';
import { readFileSync } from 'fs'
import { join } from 'path'
import { resolvers } from './resolvers'
import { Request, Response } from 'express'
import { db, ExtendedProtocol } from '../db';

// Construct a schema, using GraphQL schema language

const schemaFilePath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaFilePath, 'utf8')

export interface GraphQLContext {
    req: Request
    res: Response
    db: ExtendedProtocol
}

export const createGraphqlServer = (): ApolloServer => {
    return new ApolloServer({
        typeDefs, resolvers, playground: true, context: ({ req, res }): GraphQLContext => ({
            req,
            res,
            db
        })
    })
}