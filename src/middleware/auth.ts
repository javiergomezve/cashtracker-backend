import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error("Unauthorized");
        return res.status(401).json({ error: error.message });
    }

    const [, token] = bearer.split(" ");
    if (!token) {
        const error = new Error("Unauthorized");
        return res.status(401).json({ error: error.message });
    }

    try {
        const userId = verifyJWT(token);
        req.user = await User.findByPk(userId, {
            attributes: ["id", "email", "firstName", "lastName", "email"],
        });

        next();
    } catch (e) {
        return res.status(500).json({ error: "Invalid token" });
    }
}
