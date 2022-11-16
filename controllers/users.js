import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

import User from "../models/users.js"

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        if (existingUser.status === "Blocked") {
            return res.status(401).json({ message: "This user is Blocked" })
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "1h" })
        const updatedUser = await User.findByIdAndUpdate(existingUser._id, { lastLoginAt: Date.now() }, { new: true })

        res.status(200).json({ result: updatedUser, token })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}
export const signup = async (req, res) => {

    const { email, password, confirmPassword, firstName, lastName } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match." })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, registeredAt: Date.now() })

        res.status(200).json({ result })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const changeStatus = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No User with that id")

    // Blocked, Deleted, Active 


    const user = await User.findById(id)

    let updatedUser;
    if (req.body.status !== "Deleted") {
        updatedUser = await User.findByIdAndUpdate(id, { status: req.body.status }, { new: true })
    } else {
        await User.findByIdAndRemove(id)
        updatedUser = "Deleted"
    }
    res.json(updatedUser)
}