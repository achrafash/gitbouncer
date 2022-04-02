import type { NextApiRequest, NextApiResponse } from "next"
import { withAuthAPI } from "utils/auth"

const ACCESS_TOKEN_ENDPOINT = "https://github.com/login/oauth/access_token"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req

    if (method === "GET") {
        const { code } = req.query
        console.log({ code })

        const response = await fetch(ACCESS_TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: String(process.env.GITHUB_CLIENT_ID),
                client_secret: String(process.env.GITHUB_CLIENT_SECRET),
                redirect_uri: `${String(
                    process.env.NEXT_PUBLIC_URI
                )}/api/auth/callback`,
                code,
                state: String(process.env.LOGIN_STATE),
            }),
        })
        const data = await response.text()
        console.log({ data })
        let params = new URLSearchParams(data)
        let accessToken = params.get("access_token")

        const profileResponse = await fetch(`https://api.github.com/graphql`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                query: `query { 
                    viewer 
                    {
                        login
                        avatarUrl
                        email
                        name
                    }
                }`,
            }),
        })
        const profile = await profileResponse.json()

        // TODO - save user info in the database

        req.session.user = { ...profile.data.viewer, accessToken }
        await req.session.save()

        res.redirect(req.session.redirect || "/")
        return
    }

    res.setHeader("Allow", ["GET"])
    return res.status(405).send(`Method ${method} not allowed`)
}

export default withAuthAPI(handler)
