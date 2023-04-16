import type { NextPage } from "next"
import { useRouter } from "next/router"
import { withAuthPublic } from "utils/auth"
import prisma from "utils/db"
import NotFoundPage from "pages/404"
import { useEffect, useState } from "react"

// FIXME - figure out why GraphQL doesn't return success and display the right error message

interface PageProps {
    user: { token: string; login: string }
    repo: {
        id: number
        fullname: string
        htmlUrl: string
    }
}

const RedirectPage: NextPage<PageProps> = ({ user, repo }) => {
    const [error, setError] = useState<string>()

    useEffect(() => {
        // send the request to create the add collab mutation
        async function joinRepo() {
            const response = await fetch(`/api/graphql`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    query: "mutation Invite($input: AddCollaboratorInput) { success:addCollaborator(input: $input) }",
                    variables: {
                        input: {
                            repoId: Number(repo.id),
                            joiner: String(user.login),
                        },
                    },
                }),
            })
            const { data } = await response.json()
            console.log({ data })
            // if (data.success)
            window.location.href = repo.htmlUrl
            // else setError("Ooops! Something went wrong...")
        }
        if (user) {
            joinRepo()
        }
    })

    if (repo === null || user === null) return <NotFoundPage />

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100">
            <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto py-24 px-6">
                <p className="mb-4 text-center">
                    Please wait while we add you to <b>{repo.fullname}...</b>
                </p>
                {error && (
                    <div className="py-2 px-8 rounded bg-red-200 text-red-800 text-center">
                        <p className="text-sm font-bold select-none">{error}</p>
                    </div>
                )}
            </div>
        </main>
    )
}

export const getServerSideProps = withAuthPublic(async ({ params }: any) => {
    const { uuid } = params
    const repo = await prisma.repository.findUnique({
        where: { uuid: String(uuid) },
        select: {
            repoId: true,
            fullname: true,
            htmlUrl: true,
        },
    })
    if (!repo) return { props: { repo: null } }

    return {
        props: {
            repo: {
                id: repo.repoId,
                fullname: repo.fullname,
                htmlUrl: repo.htmlUrl,
            },
        },
    }
})

export default RedirectPage
