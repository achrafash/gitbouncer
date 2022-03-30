import type { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN_ENDPOINT = "https://github.com/login/oauth/access_token";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method === "GET") {
        const { code } = req.query;
        console.log({ code });

        const response = await fetch(ACCESS_TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: String(process.env.GITHUB_CLIENT_ID),
                client_secret: String(process.env.GITHUB_CLIENT_SECRET),
                code,
            }),
        });
        const data = await response.text();
        let params = new URLSearchParams(data);
        let accessToken = params.get("access_token");
        return res.status(200).send({ accessToken });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} not allowed`);
}
