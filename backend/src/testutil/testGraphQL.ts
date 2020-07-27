import { GraphQLResponse } from 'apollo-server-types'
import { print, DocumentNode } from 'graphql'
import { App } from '../app'
import axiosist from 'axiosist'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { HttpStatusCode } from '../util/httpErrors'

type StringOrAst = string | DocumentNode

// A query must not come with a mutation (and vice versa).
type Query = {
    query: StringOrAst
    mutation?: undefined
    variables?: {
        [name: string]: any
    }
    operationName?: string
}

type Mutation = {
    mutation: StringOrAst
    query?: undefined
    variables?: {
        [name: string]: any
    }
    operationName?: string
}

export interface GraphQLTestClient {
    query: (query: Query) => Promise<GraphQLResponse>
    mutate: (mutation: Mutation) => Promise<GraphQLResponse>
}

export const makeGraphQLTestClient = (app: App, reqConfig?: AxiosRequestConfig): GraphQLTestClient => {
    const test = async ({ query, mutation, ...args }: Query | Mutation) => {
        const operation = query || mutation

        if (!operation || (query && mutation)) {
            throw new Error(
                'Either `query` or `mutation` must be passed, but not both.',
            )
        }
        const resp = await axiosist(app.express).post('/api/v1/graphql', {
            // Convert ASTs, which are produced by `graphql-tag` but not currently
            // used by `executeOperation`, to a String using `graphql/language/print`.
            query: typeof operation === 'string' ? operation : print(operation),
            ...args,
        }, reqConfig)
        expect(resp.status).toEqual(HttpStatusCode.Success)
        return resp.data
    }

    return { query: test, mutate: test }
}