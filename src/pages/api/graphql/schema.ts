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
        repoId: Int!
        owner: User!
        uuid: String!
        name: String!
        fullname: String!
        htmlUrl: String!
        shareableLink: String
        createdAt: Date!
        deletedAt: Date
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
        disableSharing(repoId: Int!): Repository
    }
`

export default typeDefs
