import { NextApiRequest, NextApiResponse } from "next"
import { withAuthAPI } from "utils/auth"

export default withAuthAPI((req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy()
    res.redirect("/")
    return
})
