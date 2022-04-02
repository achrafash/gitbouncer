import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number
            accessToken: string
            email: string
        }
        redirect?: string
    }
}

export const authOpts = {
    cookieName: String(process.env.COOKIE_NAME),
    password: String(process.env.SESSION_SECRET),
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}

export const withAuthAPI = (handler: NextApiHandler) =>
    withIronSessionApiRoute(
        async (req: NextApiRequest, res: NextApiResponse) => {
            // const user = req.session.get("user");
            return handler(req, res)
        },
        authOpts
    )

export const withAuthPublic = (handler?: any) =>
    withIronSessionSsr<{ user: any; expiresAt: Date }>(
        async ({ req, res, params }: any) => {
            if (!req.session.user && req.url !== "/") {
                // Trigger authentication
                res.setHeader("location", "/api/auth/signin")
                res.statusCode = 302
                res.end()
                return { props: {} }
            }

            let defaultProps: any = { user: req.session.user || null }
            if (handler) {
                let { props } = await handler({ req, res, params })
                defaultProps = { ...defaultProps, ...props }
            }
            return { props: defaultProps }
        },
        authOpts
    )
