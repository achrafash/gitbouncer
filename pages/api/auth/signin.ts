import type { NextApiRequest, NextApiResponse } from "next"

// const SCOPES = "read:user,user:email,repo:invite"
const SCOPES = "read:user,user:email,repo" // FIXME - figure out the minimal scopes

const redirectComponent = encodeURIComponent(
    `${String(process.env.NEXT_PUBLIC_URI)}/api/auth/callback`
)

const AUTHORIZATION_ENDPOINT = `https://github.com/login/oauth/authorize?scope=${SCOPES}&client_id=${encodeURIComponent(
    String(process.env.GITHUB_CLIENT_ID)
)}&redirect_uri=${redirectComponent}&state=${String(process.env.LOGIN_STATE)}`

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req
    if (method === "GET") {
        return res.redirect(AUTHORIZATION_ENDPOINT)
    }

    res.setHeader("Allow", ["GET"])
    return res.status(405).end(`Method ${method} not allowed`)
}
