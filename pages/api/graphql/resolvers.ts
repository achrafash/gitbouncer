const resolvers = {
    User: {
        repositories: () => {},
    },

    Repository: {
        owner: () => {},
    },

    Query: { me: () => {}, repositories: () => {} },
    Mutation: {
        generateShareableLink: () => {},
    },
}

export default resolvers
