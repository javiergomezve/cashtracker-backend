import jwt from "jsonwebtoken"

export function generateJWT(id: string) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}