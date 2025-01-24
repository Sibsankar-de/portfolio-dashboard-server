import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
    },
    resume: {
        type: String,
    },
    password: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        require: true
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    const isCorrect = await bcrypt.compare(password, this.password)

    return isCorrect
}

userSchema.methods.generateAccessToken = async function () {
    return (
        jwt.sign(
            {
                fullName: this.fullName,
                _id: this._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return (
        jwt.sign(
            {
                _id: this._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    )
}

export const User = mongoose.model('User', userSchema)