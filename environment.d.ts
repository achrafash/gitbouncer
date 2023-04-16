declare namespace NodeJS {
    interface ProcessEnv {
        readonly NEXT_PUBLIC_URI: string
        readonly GITHUB_CLIENT_ID: string
        readonly GITHUB_CLIENT_SECRET: string
        readonly LOGIN_STATE: string
        readonly COOKIE_NAME: string
        readonly SESSION_SECRET: string
        readonly MAIL_PASS: string
        readonly MAIL_USER: string
        readonly DATABASE_URL: string
    }
}
