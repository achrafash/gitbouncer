import type { NextApiRequest, NextApiResponse } from "next"
import { withAuthAPI } from "utils/auth"
import { createOAuthUserAuth } from "@octokit/auth-oauth-user"
import { Octokit } from "octokit"
import prisma from "utils/db"

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query

    const auth = createOAuthUserAuth({
        clientId: String(process.env.GITHUB_CLIENT_ID),
        clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
        code: String(code),
        state: String(process.env.LOGIN_STATE),
        redirectUrl: `${String(process.env.NEXT_PUBLIC_URI)}/api/auth/callback`,
    })

    // Exchanges the code for the user access token authentication on first call
    // and caches the authentication for successive calls
    const { token } = await auth()
    const octokit = new Octokit({ auth: token })
    const { data } = await octokit.request("GET /user")
    const { data: emailData } = await octokit.request("GET /user/emails")
    // get the email that has the property "primary" to true
    const primaryEmail = emailData.filter((data) => data.primary)
    if (primaryEmail.length === 0) throw Error("Missing primary email")

    const user = {
        email: primaryEmail[0].email,
        login: data.login,
        uid: data.id,
        fullname: data.name,
        picture: data.avatar_url,
        token,
    }
    req.session.user = user
    await req.session.save()

    await prisma.user.upsert({
        where: { uid: user.uid },
        create: {
            uid: user.uid,
            email: user.email,
            login: user.login,
            fullname: user.fullname,
            picture: user.picture,
            token,
        },
        update: {
            token,
        },
    })

    const redirect = req.session.redirect || "/dashboard"
    req.session.redirect = undefined
    await req.session.save()

    res.redirect(redirect)
    return
}

export default withAuthAPI(handler)
