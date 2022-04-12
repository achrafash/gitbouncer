import type { NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
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
    const router = useRouter()
    const redirectUrl = router.asPath + "/redirect"

    if (repo === null) return <Error statusCode={404} />
    return (
        <main className="min-h-screen bg-gray-900 text-gray-100">
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
    const { uuid } = params
    const repo = await prisma.repository.findUnique({
        where: { uuid: String(uuid) },
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
