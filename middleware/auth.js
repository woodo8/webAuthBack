import jwt, { decode } from "jsonwebtoken"

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        let decodedData

        if (token) {
            decodedData = jwt.verify(token, "test")
            req.userId = decodedData?.id
        } else {
            return res.status(401).json({ message: "Authentification credentials not found" })
        }
        next()
    } catch (error) {
        res.status(401).json({ message: "Authentification credentials not found" })
    }
}

export default auth