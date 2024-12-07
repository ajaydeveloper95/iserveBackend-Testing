import { ApiResponse } from "../../utils/ApiResponse.js"
import userDB from "../../models/user.model.js"
import bcrypt from "bcrypt"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"

// Generation accessToken and refereshToken
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userDB.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const getUser = asyncHandler(async (req, res) => {
    let user = await userDB.find()
    if (user.length === 0) {
        return res.status(400).json({ message: "Failed", data: "User Not Avabile" })
    }
    res.status(200).json(new ApiResponse(200, data))
})

export const getSingleUser = asyncHandler(async (req, res) => {
    let data = req.params.id
    let user = await userDB.findById(data);
    if (!user) {
        return res.status(400).json({ message: "Failed", data: "User Not Avabile" })
    }
    res.status(200).json(new ApiResponse(200, user))
})

export const addUser = asyncHandler(async (req, res) => {
    let user = await userDB.create(req.body).then((data) => {
        res.status(201).json(new ApiResponse(201, data))
    })
})

export const updateUser = asyncHandler(async (req, res) => {
    let id = req.params.id
    let user = await userDB.findByIdAndUpdate(id, req.body).then((data) => {
        res.status(200).json(new ApiResponse(200, data))
    })
})

export const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    let user = await userDB.findOne({ email: email, password: password });

    if (!user) {
        return res.status(404).json({ message: "Failed", data: "Invalid credentials or User not avabile !" })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    let options = { httpOnly: true, secure: true }
    let storeValue = { user: user, accessToken, refreshToken }
    return res.cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).status(200).json(
        new ApiResponse(200, storeValue, "User logged In Successfully")
    )

})

export const logOut = asyncHandler(async (req, res) => {
    let userInfo = await userDB.findById(req.user._id);
    userInfo.refreshToken = undefined;
    await userInfo.save();
    res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json(new ApiResponse(200, null, "User logged Out Successfully"))
})