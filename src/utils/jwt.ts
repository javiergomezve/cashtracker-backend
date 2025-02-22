import jwt from "jsonwebtoken";

export function generateJWT(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

export function verifyJWT(token: string): string {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decode === "object" && decode.id) {
        return decode.id;
    }
}
