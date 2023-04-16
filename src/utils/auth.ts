import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            uid: number
            token: string
            login: string
            email: string
            picture: string
            fullname: string | null
        }
        redirect?: string
    }
}

export const authOpts = {
    cookieName: process.env.COOKIE_NAME,
    password: process.env.SESSION_SECRET,
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

export const withAuthPublic = (handler?: any, authRequired: boolean = false) =>
    withIronSessionSsr<{ user: any; expiresAt: Date }>(
        async ({ req, res, params }: any) => {
            if (!req.session.user && req.url !== "/" && authRequired) {
                // Trigger authentication
                res.setHeader("location", "/api/auth/login")
                res.statusCode = 302
                res.end()
                return { props: {} }
            }

            if (req.session.user && req.url === "/") {
                res.setHeader("location", req.session.user.login)
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
