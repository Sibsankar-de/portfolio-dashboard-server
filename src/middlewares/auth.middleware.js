import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import jwt from "jsonwebtoken"

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) throw new ApiError(401, "Unauthorized request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) throw new ApiError(401, "Token expired")
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid accesstoken")
    }
}

export { verifyJwt }