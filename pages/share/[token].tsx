import Link from "next/link"
import type { NextPage } from "next"
import { withAuthPublic } from "utils/auth"
import { GitHub as GitHubIcon } from "react-feather"

interface PageProps {
    user: { accessToken: string; login?: string }
    repo: { id: number; name: string; owner: string; url: string }
}

const SharePage: NextPage<PageProps> = ({ user, repo }) => {
    return (
        <main className="min-h-screen bg-gray-900 text-gray-100">
            <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto py-24">
                <h3 className="text-xl">
                    Join {repo.name} by {repo.owner}
                </h3>
                <Link href={`/api/auth/login?redirect=${repo.url}`}>
                    <button className="bg-black text-white border border-gray-600 rounded py-2 px-8 flex items-center space-x-4">
                        <GitHubIcon size={14} />
                        <span>Login with Github</span>
                    </button>
                </Link>
            </div>
        </main>
    )
}

export const getServerSideProps = withAuthPublic(() => {
    return {
        props: {
            repo: {
                id: 0,
                name: "Wordle RL",
                owner: "AchrafAsh",
                url: "https://github.com/achrafash/wordle_rl",
            },
        },
    }
})

export default SharePage
