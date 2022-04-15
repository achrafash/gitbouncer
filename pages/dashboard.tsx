import type { NextPage } from "next"
import { FC, ChangeEvent, useRef, useCallback } from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
    Unlock as UnlockIcon,
    Lock as LockIcon,
    Copy as CopyIcon,
    Check as CheckIcon,
    Search as SearchIcon,
} from "react-feather"
import { Octokit } from "octokit"
import { withAuthPublic } from "utils/auth"
import prisma from "utils/db"
import Layout from "components/layout"

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
                        <RepoCard
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

const CopyButton: FC = ({ children }) => {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 3000)
        }
    }, [copied])

    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(String(children))
                setCopied(true)
            }}
            disabled={copied}
            title="Copy to clipboard"
            className="py-1 px-2 bg-gray-600"
        >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        </button>
    )
}

interface RepoCardProps {
    id: number
    name: string
    fullname: string
    description: string
    htmlUrl: string
    owner: any
    link?: string
}

const RepoCard: FC<RepoCardProps> = ({
    id,
    name,
    fullname,
    description,
    htmlUrl,
    owner,
    link,
}) => {
    const [shareableLink, setShareableLink] = useState(link || "")

    async function createLink() {
        const response = await fetch(`/api/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${owner.token}`,
            },
            body: JSON.stringify({
                query: "mutation CreateLink($input: CreateShareableLinkInput) { link:createShareableLink(input: $input) }",
                variables: {
                    input: {
                        repoId: id,
                        name,
                        fullname,
                        htmlUrl,
                        ownerId: owner.id,
                    },
                },
            }),
        })
        const { data } = await response.json()
        if (!data || !data.link) return alert("something went wrong")
        console.log({ data })
        setShareableLink(data.link)
    }

    async function disableLinkSharing() {
        const response = await fetch(`/api/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${owner.token}`,
            },
            body: JSON.stringify({
                query: "mutation DisableSharing($repoId: Int!) { disableSharing(repoId: $repoId) { repoId } }",
                variables: { repoId: id },
            }),
        })
        const { data, errors } = await response.json()
        console.log({ data, errors })
        setShareableLink("")
    }

    return (
        <li className="w-full max-w-sm mx-auto flex flex-col border border-gray-600 rounded shadow p-6 bg-black space-y-4 hover:border-gray-400 transition-all">
            <div className="flex justify-between items-start space-x-4">
                <div className="flex-1">
                    <h4 className="font-medium text-white">{name}</h4>
                    <small className="text-gray-400 text-xs">{fullname}</small>
                </div>
                {shareableLink === "" ? (
                    <button
                        onClick={createLink}
                        className="p-1"
                        title="Create shareable link"
                    >
                        <LockIcon size={16} />
                    </button>
                ) : (
                    <button
                        onClick={disableLinkSharing}
                        className="p-1"
                        title="Stop sharing"
                    >
                        <UnlockIcon size={16} />
                    </button>
                )}
            </div>
            <p
                className="flex-1 font-light text-sm line-clamp-3"
                title={description || ""}
            >
                {description || ""}
            </p>
            {shareableLink && (
                <div className="flex">
                    <div className="w-full border border-gray-600 bg-gray-800 text-sm truncate p-1">
                        {shareableLink}
                    </div>
                    <CopyButton>{shareableLink}</CopyButton>
                </div>
            )}
        </li>
    )
}

export const getServerSideProps = withAuthPublic(async ({ req }: any) => {
    let sharedRepos = await prisma.repository.findMany({
        where: {
            owner: { token: req.session.user.token },
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
