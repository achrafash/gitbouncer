import Link from "next/link"
import { GitHub as GitHubIcon, ArrowRight } from "react-feather"

export default function LoginButton() {
    return (
        <div>
            <Link passHref href="/api/auth/login">
                <button className="group bg-gradient-to-b from-zinc-900 to-black text-zinc-300 hover:text-white border border-zinc-600 rounded-full py-2 px-6 flex items-center transition-all hover:border-zinc-400">
                    <GitHubIcon size={18} />
                    <div className="relative px-4">
                        <span>Login with Github</span>
                        <ArrowRight
                            size={18}
                            className="top-1/2 right-0 -translate-y-1/2 -translate-x-full absolute group-hover:translate-x-2 opacity-0 group-hover:opacity-100 transition-all"
                        />
                    </div>
                </button>
            </Link>
        </div>
    )
}
