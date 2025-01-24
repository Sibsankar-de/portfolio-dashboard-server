import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromClodinary, uploadOnCloudinary } from "../utils/cloudinary-connects.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req?.body

    if ([fullName, email, password].some(e => e === '')) throw new ApiError(400, "All fields are required")

    const existedUser = await User.findOne({ email })
    if (existedUser) throw new ApiError(400, "User already exist")

    const user = await User.create({
        fullName,
        email,
        password
    })

    if (!user) throw new ApiError(400, "Unable to create User")

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    return (
        res.status(200)
            .json(new ApiResponse(200, {}, "User created Successfully"))
    )
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        if (!accessToken || !refreshToken) throw new ApiError(500, "Error on generating tokens")

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Unable to generate tokens right now")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req?.body
    if ([email, password].some(e => e === '')) throw new ApiError(400, "Email and password is required")

    const user = await User.findOne({ email })

    if (!user) throw new ApiError(401, "Un authorized user")

    const passwordCorrect = await user.isPasswordCorrect(password);
    if (!passwordCorrect) throw new ApiError(400, "Incorrect password")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }

    const loggedinUser = await User.findById(user?._id).select("-password -refreshToken")
    return (
        res.status(200)
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .json(new ApiResponse(200, accessToken, "User loggedin successfully"))
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return (
        res.status(200)
            .clearCookie('accessToken', cookieOptions)
            .clearCookie('refreshToken', cookieOptions)
            .json(new ApiResponse(200, {}, "User log out successfully"))
    )

})

const updateUser = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName && !email) {
        throw new ApiError(400, "Any one field is required")
    }

    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if (fullName) {
        user.fullName = fullName
    }
    if (email) {
        user.email = email
    }

    await user.save({ validateBeforeSave: false })

    res.status(200)
        .json(new ApiResponse(200, {}, "User updated successfully"))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required")
    const avatar = await uploadOnCloudinary(avatarLocalPath)


    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if (!user) throw new ApiError(401, "Unauthorised request")
    if (user.avatar) {
        const oldAvatar = user.avatar
        await deleteFromClodinary(oldAvatar)
    }

    user.avatar = avatar.url

    await user.save({ validateBeforeSave: false })

    return (
        res.status(200)
            .json(new ApiResponse(200, {}, "Avatar updated"))
    )

})

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if ([oldPassword, newPassword].some(e => e === '')) throw new ApiError(400, "All fields are required")

    const user = await User.findById(req.user?._id)
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isOldPasswordCorrect) throw new ApiError(400, "Incorrect old password")
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return (
        res.status(200)
            .json(new ApiResponse(200, {}, "Password updated"))
    )

})

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    if (!user) throw new ApiError(401, "User not found")

    return (
        res.status(200)
            .json(new ApiResponse(200, user, "User fetched successfully"))
    )
})

// update user resume
const updateUserResume = asyncHandler(async (req, res) => {
    const resumeLocalPath = req.file?.path
    const user = await User.findById(req.user?._id).select("-password -refreshToken");

    if (!resumeLocalPath) throw new ApiError(400, "Resume is required")
    const resume = await uploadOnCloudinary(resumeLocalPath);
    if (!resume) throw new ApiError(500, "Unable to upload resume");
    if (user?.resume) {
        const oldResume = user.resume;
        await deleteFromClodinary(oldResume);
    }
    user.resume = resume?.url;
    user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, user, "Resume updated"));
})

const getResume = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const resume = await User.findById(userId).select("resume");
    if (!resume) throw new ApiError(404, "Resume not found");
    return res.status(200).json(new ApiResponse(200, resume, "Resume fetched successfully"));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    updateAvatar,
    updatePassword,
    currentUser,
    updateUserResume,
    getResume
}