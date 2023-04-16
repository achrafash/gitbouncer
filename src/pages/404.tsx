import Layout from "components/layout"
import type { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"

const NotFoundPage: NextPage = () => (
    <Layout title="GitBouncer | Oops you got lost...">
        <div className="max-w-2xl mx-auto h-screen py-24 md:divide-x flex flex-col md:flex-row items-center">
            <div className="p-8">
                <Image src="/icon.png" alt="Logo" width={140} height={140} />
            </div>

            <div className="p-8 flex flex-col">
                <h1 className="text-4xl font-black mb-6">404 Not Found</h1>
                <p className="text-gray-400 text-lg">
                    Looking to create links for your private repos?{" "}
                    <Link href="/api/auth/login">
                        <a className="underline underline-offset-2 text-gray-300">
                            Login with Github
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    </Layout>
)

export default NotFoundPage
