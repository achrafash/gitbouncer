import type { FC, ReactNode } from "react"
import { useState, useEffect } from "react"
import {
    Unlock as UnlockIcon,
    Lock as LockIcon,
    Copy as CopyIcon,
    Check as CheckIcon,
} from "react-feather"
import { Spinner } from "components/ui"

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
        <li className="w-full max-w-sm mx-auto flex flex-col border border-gray-600 rounded shadow p-6 bg-black space-y-4 hover:border-gray-400 transition-all">
            <div className="flex justify-between items-start space-x-4">
                <div className="flex-1">
                    <h4 className="font-medium text-white">{name}</h4>
                    <small className="text-gray-400 text-xs">{fullname}</small>
                </div>
                {loading ? (
                    <Spinner />
                ) : shareableLink === "" ? (
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
            {loading ? (
                <div className="animate-pulse rounded-lg bg-gray-700 h-5" />
            ) : (
                shareableLink && (
                    <div className="flex">
                        <div className="w-full border border-gray-600 bg-gray-800 text-sm truncate p-1">
                            {shareableLink}
                        </div>
                        <CopyButton>{shareableLink}</CopyButton>
                    </div>
                )
            )}
        </li>
    )
}

export default RepoItem
