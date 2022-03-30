import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method === "GET") {
        res.status(200).json({ name: "John Doe" });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} not allowed`);
}
