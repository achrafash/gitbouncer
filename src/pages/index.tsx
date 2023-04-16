import type { NextPage } from "next"
import Image from "next/image"
import { withAuthPublic } from "utils/auth"
import Layout from "components/layout"
import LoginButton from "@/components/login-button"

const LandingPage: NextPage = () => {
    return (
        <Layout title="GitBouncer | Shareable Links for your Private Repos">
            <div className="max-w-2xl mx-auto px-6 py-10 md:py-24 text-center flex flex-col items-center space-y-10">
                <div>
                    <Image
                        src="/icon.png"
                        alt="Logo"
                        width={140}
                        height={140}
                    />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-500">
                    {/* className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-br from-white to-zinc-500" */}
                    Shareable Links
                    <br /> for Private Repos
                </h1>

                <p className="text-zinc-400 leading-relaxed">
                    Sharing a private repo is awkward. Not anymore.
                    <br />
                    Create a shareable link in one click.
                    <br />
                    No need to make your repo public 🔒
                </p>

                <LoginButton />
            </div>
        </Layout>
    )
}

export const getServerSideProps = withAuthPublic()

export default LandingPage
