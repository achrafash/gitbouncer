import Head from "next/head"
import type { FC, ReactNode } from "react"

interface SEOProps {
    title?: string
    description?: string
}

const defaultTitle = "GitBouncer"
const defaultDescription = "Shareable Links for your Private Repos"

const SEO: FC<SEOProps> = ({ title, description }) => {
    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>{title || defaultTitle}</title>
            <meta
                name="description"
                content={description || defaultDescription}
            />
            <meta property="og:title" content={title} />
            <meta
                property="og:description"
                content={description || defaultDescription}
            />
            <meta property="og:url" content="https://gitbouncer.vercel.app" />
            <meta property="og:site_name" content="GitBouncer" />
            <meta
                property="og:image"
                content="https://gitbouncer.vercel.app/twitter_card.jpg"
            />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@AchrafTOTW" />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta
                name="twitter:description"
                content={description || defaultDescription}
            />
            <meta
                name="twitter:image"
                content="https://gitbouncer.vercel.app/twitter_card.jpg"
            />
        </Head>
    )
}

interface LayoutProps {
    title?: string
    description?: string
    children: ReactNode
}

const Layout: FC<LayoutProps> = ({ title, description, children }) => (
    <>
        <SEO title={title} description={description} />
        <main className="min-h-screen bg-gradient-to-b from-zinc-800 to-black  text-gray-100">
            {children}
        </main>
    </>
)

export default Layout
