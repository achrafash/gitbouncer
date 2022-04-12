import "graphql-import-node"
import type { NextApiRequest, NextApiResponse } from "next"
import { ApolloServer } from "apollo-server-micro"
import typeDefs from "./schema"
import resolvers from "./resolvers"
import { createContext } from "./context"

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext,
})

export const config = {
    api: {
        bodyParser: false,
    },
}

const startServer = apolloServer.start()

async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    )
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    if (req.method === "OPTIONS") {
        res.end()
        return false
    }

    await startServer
    await apolloServer.createHandler({
        path: "/api/graphql",
    })(req, res)
}

export default handler
