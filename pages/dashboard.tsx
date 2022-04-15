import type { NextPage } from "next"
import { FC, ChangeEvent, useRef, useCallback } from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Search as SearchIcon } from "react-feather"
import { Octokit } from "octokit"
import { withAuthPublic } from "utils/auth"
import prisma from "utils/db"
import Layout from "components/layout"
import { RepoItem } from "components/repo-item"

interface PageProps {
    user: {
        login: string
        fullname: string
        picture: string
        token: string
    }
    sharedRepos: {
        repoId: number
        shareableLink: string
    }[]
}

interface Repo {
    id: number
    html_url: string
    description: string | null
    name: string
    full_name: string
    [property: string]: any
}

const DashboardPage: NextPage<PageProps> = ({ user, sharedRepos }) => {
    const [allRepositories, setAllRepositories] = useState<Repo[]>([])
    const [filteredRepositories, setFilteredRepositories] = useState<Repo[]>([])

    const getPrivateRepositories = useCallback(
        async function (): Promise<Repo[]> {
            const octokit = new Octokit({ auth: user.token })
            const { data } = await octokit.request("GET /user/repos", {
                visibility: "private",
            })
            return data
        },
        [user]
    )

    const attachLink = useCallback(
        function (repositories: Repo[]): Repo[] {
            return repositories.map((repo) => {
                const matchedRepo = sharedRepos.filter(
                    (r: any) => r.repoId === repo.id
                )
                let link: string | null = null

                if (matchedRepo.length > 0) {
                    link = matchedRepo[0].shareableLink
                }

                return {
                    ...repo,
                    link,
                }
            })
        },
        [sharedRepos]
    )

    useEffect(() => {
        async function init() {
            let repositories = await getPrivateRepositories()
            repositories = attachLink(repositories)
            setAllRepositories(repositories)
            setFilteredRepositories(repositories)
        }
        init()
    }, [user, sharedRepos, attachLink, getPrivateRepositories])

    async function filterRepositories(e: ChangeEvent<HTMLInputElement>) {
        const query = e.target.value

        if (query === "") setFilteredRepositories(allRepositories)

        let foundRepositories: Repo[] = allRepositories.filter((item) => {
            return Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        })

        if (foundRepositories.length === 0) {
            // TODO - throttle requests to avoid stacking calls at every keystroke
            const octokit = new Octokit({ auth: user.token })
            const { data } = await octokit.request("GET /search/repositories", {
                q: `${query}+in:name+is:private+user:${user.login}`,
            })
            console.log({ data })
            foundRepositories = attachLink(data.items)
        }
        setFilteredRepositories(foundRepositories)
    }

    return (
        <Layout title="GitBouncer | Dashboard">
            <header className="py-4 px-6 border-b border-gray-600 flex flex-col-reverse items-center justify-between md:flex-row md:space-y-0">
                <SearchBar onChange={filterRepositories} />

                <div className="flex items-center space-x-4 w-fit mb-6 md:m-0">
                    <span className="text-sm">{user.login}</span>
                    <div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-gray-900">
                        <Image
                            className="w-full"
                            src={
                                user.picture ||
                                "https://wallpaperaccess.com/full/4595683.jpg"
                            }
                            width={40}
                            height={40}
                            alt="Profile Pic"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto py-12 px-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRepositories.map((repo) => (
                        <RepoItem
                            key={repo.id}
                            id={repo.id}
                            name={repo.name}
                            fullname={repo.full_name}
                            description={repo.description || ""}
                            htmlUrl={repo.html_url}
                            owner={{ token: user.token, id: repo.owner.id }}
                            link={repo.link}
                        />
                    ))}
                </ul>
            </div>
        </Layout>
    )
}

interface SearchBarProps {
    onChange(e: ChangeEvent<HTMLInputElement>): void
}

const SearchBar: FC<SearchBarProps> = ({ onChange }) => {
    const ref = useRef<HTMLInputElement>(null)

    function bindFocusHotKey(e: KeyboardEvent) {
        if (e.key === "/" && ref.current) {
            e.preventDefault()
            ref.current.focus()
        }
    }

    useEffect(() => {
        if (document) {
            document.addEventListener("keypress", bindFocusHotKey)
        }
        return () => document.removeEventListener("keypress", bindFocusHotKey)
    })

    return (
        <form
            className="border border-gray-600 rounded flex-1 w-full flex items-center max-w-sm mx-auto"
            onSubmit={(e) => {
                e.preventDefault()
            }}
        >
            <div className="py-2 px-4">
                <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
                ref={ref}
                type="text"
                name="search"
                id="search"
                placeholder="Search..."
                onChange={onChange}
                className="flex-1 py-2 pr-4 bg-transparent text-sm font-light focus:outline-none"
            />
            <div className="shadow-inner shadow-gray-400 bg-gray-200 border border-black m-2 px-2 rounded-sm ring-2 ring-offset-gray-900 ring-offset-1">
                <span className="text-gray-600 text-xs font-bold">/</span>
            </div>
        </form>
    )
}

export const getServerSideProps = withAuthPublic(async ({ req, res }: any) => {
    const user = await prisma.user.findFirst({
        where: { token: req.session.user.token },
    })
    if (!user) {
        // Trigger authentication
        res.setHeader("location", "/api/auth/login")
        res.statusCode = 302
        res.end()
        return { props: {} }
    }
    let sharedRepos = await prisma.repository.findMany({
        where: {
            owner: user,
            deletedAt: null,
        },
        select: {
            repoId: true,
            shareableLink: true,
        },
    })

    return {
        props: { sharedRepos },
    }
})

export default DashboardPage
