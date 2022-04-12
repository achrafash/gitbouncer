import { gql } from "apollo-server-micro"

const typeDefs = gql`
    scalar Date

    type User {
        id: Int!
        uid: String!
        email: String!
        avatarUrl: String
    }

    type Repository {
        id: Int!
        owner: User!
        token: String
        shareableLink: String
        expiresAt: Date
    }

    type Query {
        repositories: [Repository!]
    }

    input CreateShareableLinkInput {
        repoId: Int!
        name: String!
        fullname: String!
        ownerId: Int!
        htmlUrl: String!
    }

    input AddCollaboratorInput {
        repoId: Int!
        joiner: String!
    }

    type Mutation {
        createShareableLink(input: CreateShareableLinkInput): String
        addCollaborator(input: AddCollaboratorInput): Boolean
    }
`

export default typeDefs
