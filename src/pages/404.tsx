import LoginButton from "@/components/login-button"
import Layout from "components/layout"
import type { NextPage } from "next"
import Image from "next/image"

const NotFoundPage: NextPage = () => (
    <Layout title="GitBouncer | Oops you got lost...">
        <div className="max-w-3xl mx-auto h-screen py-24 flex flex-col md:flex-row items-center">
            <div className="p-8 border-r-2 border-zinc-600">
                <Image src="/icon.png" alt="Logo" width={140} height={140} />
            </div>

            <div className="p-8 flex flex-col space-y-6">
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-500">
                    404 Not Found
                </h1>
                <p className="text-zinc-400">
                    Wanna share a link to your private repo? Login to import
                    your repositories
                </p>
                <LoginButton />
            </div>
        </div>
    </Layout>
)

export default NotFoundPage
