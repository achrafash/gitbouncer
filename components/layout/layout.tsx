import Head from "next/head"
import type { FC } from "react"

interface SEOProps {
    title?: string
    description?: string
}

const defaultTitle = "GitBouncer"
const defaultDescription = "Shareable Links for your Private Repos"

const SEO: FC<SEOProps> = ({ title, description }) => {
    return (
        <Head>
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
            <meta
                property="og:image"
                content="https://gitbouncer.vercel.app/twitter_card.png"
            />
            <meta property="og:url" content="https://withcurated.com" />
            <meta property="og:site_name" content="GitBouncer" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
                name="twitter:image:alt"
                content={description || defaultDescription}
            />
            <link rel="icon" href="/favicon.ico" />
            {/* <meta name="twitter:site" content="@Pocketfunnel_" /> */}
        </Head>
    )
}

interface LayoutProps {
    title?: string
    description?: string
}

const Layout: FC<LayoutProps> = ({ title, description, children }) => (
    <>
        <SEO title={title} description={description} />
        <main className="min-h-screen bg-gray-900 text-gray-100">
            {children}
        </main>
    </>
)

export default Layout
