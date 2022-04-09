// import { PrismaClient } from "@prisma/client"
import type { PrismaClient } from "@prisma/client"
import prisma from "utils/db"

export interface Context {
    prisma: PrismaClient
    req: {
        headers: {
            authorization: string
        }
        user: {
            accessToken: string
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

    req.user = { accessToken }

    return {
        prisma,
        req,
        res,
    }
}
