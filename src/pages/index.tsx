import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { GitHub as GitHubIcon } from "react-feather"
import { withAuthPublic } from "utils/auth"
import Layout from "components/layout"

const LandingPage: NextPage = () => {
    return (
        <Layout title="GitBouncer | Shareable Links for your Private Repos">
            <div className="max-w-xl mx-auto px-6 py-12 md:py-24 text-center flex flex-col items-center">
                <div className="mb-12">
                    <Image
                        src="/icon.png"
                        alt="Logo"
                        width={140}
                        height={140}
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-6">
                    Shareable Links for your Private Repos
                </h1>
                <div className="text-gray-400">
                    <p className="mb-2">
                        Want to share a repo but don&apos;t want to make it
                        public?
                    </p>
                    <p>
                        Avoid the usual (awkward) back and forth.
                        <br />
                        Send them a link. Keep it private 🔐
                    </p>
                </div>

                <div className="mt-12">
                    <Link passHref href="/api/auth/login">
                        <button className="bg-black text-white border border-gray-600 rounded py-2 px-8 flex items-center space-x-4 transition-all hover:border-gray-400">
                            <GitHubIcon size={14} />
                            <span>Login with Github</span>
                        </button>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps = withAuthPublic()

export default LandingPage
