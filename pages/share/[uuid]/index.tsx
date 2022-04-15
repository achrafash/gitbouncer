import type { NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
import { withAuthPublic } from "utils/auth"
import { GitHub as GitHubIcon } from "react-feather"
import prisma from "utils/db"
import NotFoundPage from "pages/404"
import { useRouter } from "next/router"
import Layout from "components/layout"

interface PageProps {
    repo: {
        name: string
        fullname: string
        owner: { login: string }
        htmlUrl: string
    }
    error: string | null
}

const SharePage: NextPage<PageProps> = ({ repo, error }) => {
    const router = useRouter()
    const redirectUrl = router.asPath + "/redirect"

    if (repo === null) return <NotFoundPage />
    return (
        <Layout
            title={`GitBouncer | ${repo.name} by ${repo.owner.login}`}
            description={`Login with your Github account to join ${repo.name} by ${repo.owner.login}`}
        >
            <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto py-24 px-6">
                <div className="mb-8">
                    <Image
                        src="/icon.png"
                        alt="Logo"
                        width={120}
                        height={120}
                    />
                </div>

                <h3 className="text-xl text-center">
                    Join <b>{repo.name}</b> by {repo.owner.login}
                </h3>
                {error !== null ? (
                    <p className="text-lg text-gray-400">{error}</p>
                ) : (
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
                )}
            </div>
        </Layout>
    )
}

export const getServerSideProps = withAuthPublic(async ({ params }: any) => {
    const { uuid } = params
    const repo = await prisma.repository.findUnique({
        where: { uuid: String(uuid) },
        select: {
            name: true,
            fullname: true,
            htmlUrl: true,
            deletedAt: true,
            owner: { select: { login: true } },
        },
    })
    let error: string | null = null
    if (!repo) return { props: { repo: null, error } }
    if (repo.deletedAt !== null) {
        error = "Oops! Too late... The gates are closed 🔒"
        repo.deletedAt = null
    }
    return {
        props: {
            repo,
            error,
        },
    }
})

export default SharePage
