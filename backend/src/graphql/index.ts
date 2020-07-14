import { ApolloServer, gql } from 'apollo-server-express';
import { readFileSync } from 'fs'
import { join } from 'path'
import { resolvers } from './resolvers'

// Construct a schema, using GraphQL schema language

const schemaFilePath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaFilePath, 'utf8')

export const createGraphqlServer = (): ApolloServer => {
    return new ApolloServer({ typeDefs, resolvers, playground: true })
}