import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    status: {
        type: String,
        default: "Active"
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    registeredAt: {
        type: Date,
        default: new Date()
    }
})

export default mongoose.model("User", userSchema)