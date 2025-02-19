import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const { email, password } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            const error = new Error("User already exists");
            return res.status(409).json({ error: error.message });
        }

        try {
            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();

            await AuthEmail.sendConfirmationEmail({
                firstName: user.firstName,
                email: user.email,
                token: user.token,
            });

            res.json("account creted");
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "somenthing went wrong" });
        }
    }

    static async confirmAccount(req: Request, res: Response) {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Invalid token");
            return res.status(401).json({ error: error.message });
        }

        user.token = "";
        user.confirmed = true;
        await user.save();

        res.send("account confirmed");
    }
}
