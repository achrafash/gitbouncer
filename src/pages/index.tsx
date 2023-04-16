import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, GitHub as GitHubIcon } from "react-feather"
import { withAuthPublic } from "utils/auth"
import Layout from "components/layout"

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

                <div>
                    <Link passHref href="/api/auth/login">
                        <button className="group bg-black text-zinc-300 hover:text-white border border-zinc-600 rounded-full py-2 px-6 flex items-center transition-all hover:border-zinc-400">
                            <GitHubIcon size={18} />
                            <div className="relative bg-black px-4">
                                <span>Login with Github</span>
                                <ArrowRight
                                    size={18}
                                    className="top-1/2 right-0 -translate-y-1/2 -translate-x-full absolute group-hover:translate-x-2 opacity-0 group-hover:opacity-100 transition-all"
                                />
                            </div>
                        </button>
                    </Link>
                    {/* <div class="text-3xl p-2 group border w-fit grid" style="clip-path: inset(0 0 0 0 );" >
                        <div class="[grid-area:1/1] flex items-center justify-center h-10 w-10 transition ease-in-out group-hover:delay-300 translate-y-10 -translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0">↗</div>
                        <div class="[grid-area:1/1] flex items-center justify-center h-10 w-10 transition ease-in-out delay-300 group-hover:delay-[0s] duration-300 group-hover:-translate-y-10 group-hover:translate-x-10">↗</div>
                    </div> */}
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps = withAuthPublic()

export default LandingPage
