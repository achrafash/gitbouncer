// import { PrismaClient } from "@prisma/client"
import type { PrismaClient } from "@prisma/client"
import prisma from "utils/db"

export interface Context {
    db: PrismaClient
    req: {
        headers: {
            authorization: string
        }
        user: {
            token: string
        }
    }
    res: any
}

export const createContext = ({ res, req }: any): Context => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        throw Error("Unauthorized")
    }
    const accessToken = authHeader.replace("Bearer ", "") // Authorization: Bearer {{token}}

    req.user = { token: accessToken }

    return {
        db: prisma,
        req,
        res,
    }
}
