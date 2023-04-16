import type { FC, ReactNode } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Unlock as UnlockIcon,
    Lock as LockIcon,
    Copy as CopyIcon,
    Check as CheckIcon,
} from "react-feather"
import { Skeleton, Spinner } from "components/ui"

interface RepoItemProps {
    id: number
    name: string
    fullname: string
    description: string
    htmlUrl: string
    owner: any
    link?: string
}

const CopyButton: FC<{ children: ReactNode }> = ({ children }) => {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            setTimeout(() => setCopied(false), 3000)
        }
    }, [copied])

    return (
        <button
            onClick={(e) => {
                navigator.clipboard.writeText(String(children))
                setCopied(true)
                e.stopPropagation()
            }}
            disabled={copied}
            title="Copy to clipboard"
            className="py-1 px-2 bg-zinc-600 rounded-r"
        >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        </button>
    )
}

const RepoItem: FC<RepoItemProps> = ({
    id,
    name,
    fullname,
    description,
    htmlUrl,
    owner,
    link,
}) => {
    const [shareableLink, setShareableLink] = useState(link || "")
    const [loading, setLoading] = useState(false)

    async function createLink() {
        setLoading(true)
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

        const { data, errors } = await response.json()
        if (errors) return alert("something went wrong")
        console.log({ data, errors })
        setShareableLink(data.link)
        setLoading(false)
    }

    async function disableLinkSharing() {
        setLoading(true)
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
        setLoading(false)
    }

    return (
        <Link href={fullname} passHref>
            <li className="cursor-pointer w-full max-w-sm mx-auto flex flex-col border border-zinc-600 rounded shadow p-6 bg-black space-y-4 hover:border-zinc-400 transition-all">
                <div className="flex justify-between items-start space-x-4">
                    <div className="flex-1">
                        <h4 className="font-medium text-white">{name}</h4>
                        <small className="text-zinc-400 text-xs">
                            {fullname}
                        </small>
                    </div>

                    {loading ? (
                        <Spinner />
                    ) : shareableLink === "" ? (
                        <button
                            onClick={(e) => {
                                createLink()
                                e.stopPropagation()
                            }}
                            className="p-1"
                            title="Create shareable link"
                        >
                            <LockIcon size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                disableLinkSharing()
                                e.stopPropagation()
                            }}
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
                {loading ? (
                    <Skeleton className="h-5 rounded-lg" />
                ) : (
                    shareableLink && (
                        <div className="flex">
                            <div className="w-full border rounded-l border-zinc-600 shadow-inner bg-gradient-to-b from-zinc-800 to-zinc-900 truncate py-1 px-2">
                                <span className="text-xs tracking-wide text-zinc-300">
                                    {shareableLink}
                                </span>
                            </div>
                            <CopyButton>{shareableLink}</CopyButton>
                        </div>
                    )
                )}
            </li>
        </Link>
    )
}

export default RepoItem
