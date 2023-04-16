import type { NextApiRequest, NextApiResponse } from "next"
import { withAuthAPI } from "utils/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req
    if (method === "GET") {
        const { redirect } = req.query

        let authorizationEndpoint =
            "https://github.com/login/oauth/authorize?" +
            new URLSearchParams({
                scope: "read:user,user:email,repo",
                client_id: process.env.GITHUB_CLIENT_ID,
                redirect_uri: process.env.NEXT_PUBLIC_URI,
                state: process.env.LOGIN_STATE,
            })
        if (req.session.user) {
            authorizationEndpoint += `&login=${req.session.user.login}`
        }
        if (redirect) {
            req.session.redirect = String(redirect)
            await req.session.save()
        }

        res.redirect(authorizationEndpoint)
        return
    }

    res.setHeader("Allow", ["GET"])
    return res.status(405).send(`Method ${method} not allowed`)
}

export default withAuthAPI(handler)
