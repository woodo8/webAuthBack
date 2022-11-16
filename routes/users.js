import express from "express"
import { signin, signup, getUsers, changeStatus } from "../controllers/users.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/", auth, getUsers)
router.post("/signin", signin)
router.post("/signup", signup)
router.patch("/changeStatus/:id", auth, changeStatus)

export default router