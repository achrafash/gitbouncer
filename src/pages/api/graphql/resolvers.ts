import { Octokit } from "octokit"
import { GraphQLDateTime } from "graphql-iso-date"
import { generate } from "short-uuid"
import type { Context } from "./context"
import { sendEmail } from "utils/email"
import { inviteeNotification } from "emails/invitee-notification"

const resolvers = {
    Date: GraphQLDateTime,

    Query: {
        repositories: (_parent: null, _args: null, ctx: Context) => {
            const { token } = ctx.req.user
            console.log({ token })
            return ctx.db.repository.findMany({ where: { owner: { token } } })
        },
    },

    Mutation: {
        createShareableLink: async (
            _parent: null,
            { input }: any,
            ctx: Context
        ) => {
            const { token } = ctx.req.user
            if (!token) throw Error("Unauthorized")

            let repo = await ctx.db.repository.findUnique({
                where: { repoId: input.repoId },
            })
            if (repo) {
                await ctx.db.repository.update({
                    where: { repoId: input.repoId },
                    data: { deletedAt: null },
                })
                return repo.shareableLink
            }

            const uuid = generate()
            const link = `${process.env.NEXT_PUBLIC_URI}/share/${uuid}`
            // save the repository and the token in the database
            try {
                await ctx.db.repository.create({
                    data: {
                        name: input.name,
                        uuid,
                        fullname: input.fullname,
                        repoId: input.repoId,
                        ownerId: input.ownerId,
                        htmlUrl: input.htmlUrl,
                        shareableLink: link,
                    },
                })
            } catch (err) {
                console.error(err)
            }

            return link
        },

        addCollaborator: async (
            _parent: null,
            {
                input: { repoId, joiner },
            }: {
                input: {
                    repoId: number
                    joiner: string
                }
            },
            ctx: Context
        ) => {
            const token = ctx.req.user.token
            if (!token) throw Error("Unauthorized")

            const repo = await ctx.db.repository.findUnique({
                where: { repoId },
                include: { owner: true },
            }) // TODO - select only the required field
            if (!repo) throw Error("Repo Not Found")

            // FIXME - handle user already invited
            let octokit = new Octokit({ auth: repo.owner.token })
            const { data } = await octokit.request(
                "PUT /repos/{owner}/{repo}/collaborators/{username}",
                {
                    owner: repo.owner.login,
                    repo: repo.name,
                    username: joiner,
                }
            )
            const invitationId = data.id

            octokit = new Octokit({ auth: token })
            await octokit.request(
                "PATCH /user/repository_invitations/{invitation_id}",
                { invitation_id: invitationId }
            )

            // send email to the owner
            try {
                await sendEmail({
                    recipient: repo.owner.email,
                    subject: `Someone joined ${repo.name}`,
                    body: inviteeNotification({
                        username: repo.owner.login,
                        invitee: joiner,
                        invitee_url: `https://github.com/${joiner}`,
                        action_url: process.env.NEXT_PUBLIC_URI,
                        repo_fullname: repo.fullname,
                        repo_url: repo.htmlUrl,
                    }),
                })
            } catch (err) {
                console.error(err)
            }
            return true
        },

        disableSharing: async (
            _parent: null,
            { repoId }: { repoId: number },
            ctx: Context
        ) => {
            console.log({ repoId })
            const repo = await ctx.db.repository.update({
                where: { repoId },
                data: { deletedAt: new Date() },
            })
            if (!repo) throw Error("Repo Not Found")
            return repo
        },
    },
}

export default resolvers
