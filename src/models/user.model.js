import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        required: [true, "Please enter mail Id !"]
    },
    memberType: {
        type: String,
        enum: ["Admin", "Users"],
        required: [true, "Please Select member Type !"]
    },
    fName: {
        type: String,
        trim: true,
        required: [true, "Please Enter first Name !"]
    },
    lName: {
        type: String,
        trim: true,
        required: [true, "Please Enter last Name !"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password !"]
    },
    refreshToken: {
        type: String
    },
    addresh: {
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        addresh: {
            type: String,
        },
        pincode: {
            type: Number,
        },
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            memberType: this.memberType
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default new model("user", userSchema);