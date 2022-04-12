import Link from "next/link"
import type { NextPage } from "next"
import jwt from "jsonwebtoken"
import { withAuthPublic } from "utils/auth"
import { GitHub as GitHubIcon } from "react-feather"
import prisma from "utils/db"
import Error from "next/error"
import { useRouter } from "next/router"

interface PageProps {
    repo: {
        name: string
        fullname: string
        owner: string
        htmlUrl: string
    }
}

const SharePage: NextPage<PageProps> = ({ repo }) => {
    if (repo === null) return <Error statusCode={404} />
    const router = useRouter()
    const redirectUrl = router.asPath + "/redirect"

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100">
            <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto py-24">
                <h3 className="text-xl">
                    Join <b>{repo.name}</b> by {repo.owner}
                </h3>
                <Link
                    passHref
                    href={`/api/auth/login?redirect=${encodeURIComponent(
                        redirectUrl
                    )}`}
                >
                    <button className="bg-black text-white border border-gray-600 rounded py-2 px-8 flex items-center space-x-4">
                        <GitHubIcon size={14} />
                        <span>Login with Github</span>
                    </button>
                </Link>
            </div>
        </main>
    )
}

export const getServerSideProps = withAuthPublic(async ({ params }: any) => {
    const { token } = params
    const { repoId }: any = jwt.verify(token, String(process.env.JWT_SECRET))
    const repo = await prisma.repository.findUnique({
        where: { repoId: Number(repoId) },
        include: { owner: true },
    })
    if (!repo) return { props: { repo: null } }

    return {
        props: {
            repo: {
                name: repo.name,
                fullname: repo.fullname,
                htmlUrl: repo.htmlUrl,
                owner: repo.owner.login,
            },
        },
    }
})

export default SharePage
