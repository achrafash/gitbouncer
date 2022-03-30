import type { NextApiRequest, NextApiResponse } from "next";

const SCOPES = "user:email,repo:invite";

const AUTHORIZATION_ENDPOINT = `https://github.com/login/oauth/authorize?scope=${SCOPES}&client_id=${encodeURIComponent(
    String(process.env.GITHUB_CLIENT_ID)
)}`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method === "GET") {
        return res.redirect(AUTHORIZATION_ENDPOINT);
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} not allowed`);
}
