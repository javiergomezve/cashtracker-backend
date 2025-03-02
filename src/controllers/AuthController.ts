import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
    static async createAccount(req: Request, res: Response) {
        const { email, password } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            const error = new Error("User already exists");
            return res.status(409).json({ error: error.message });
        }

        try {
            const user = await User.create(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();

            await AuthEmail.sendConfirmationEmail({
                firstName: user.firstName,
                email: user.email,
                token: user.token,
            });

            res.status(201).json("account created");
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

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (!userExists) {
            const error = new Error("Invalid user");
            return res.status(400).json({ error: error.message });
        }

        if (!userExists.confirmed) {
            const error = new Error("Account is not confirmed");
            return res.status(403).json({ error: error.message });
        }

        const isPasswordCorrect = await checkPassword(password, userExists.password);
        if (!isPasswordCorrect) {
            const error = new Error("Invalid password");
            return res.status(401).json({ error: error.message });
        }

        const token = generateJWT(userExists.id);

        res.send(token);
    }

    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            const error = new Error("Invalid user");
            return res.status(400).json({ error: error.message });
        }

        user.token = generateToken();
        await user.save();

        await AuthEmail.sendResetPasswordToken({
            email: user.email,
            firstName: user.firstName,
            token: user.token,
        });

        res.send("token send");
    }

    static async validateToken(req: Request, res: Response) {
        const { token } = req.body;

        const user = await User.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Invalid token");
            return res.status(400).json({ error: error.message });
        }

        res.send("token valid");
    }

    static async resetPasswordWithToken(req: Request, res: Response) {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Invalid token");
            return res.status(400).json({ error: error.message });
        }

        user.password = await hashPassword(password);
        user.token = null;
        await user.save();

        res.send("password reset successfully");
    }

    static async user(req: Request, res: Response) {
        res.json(req.user);
    }

    static async updateCurrentUserPassword(req: Request, res: Response) {
        const { current_password, password } = req.body;
        const { id } = req.user;

        const user = await User.findByPk(id);
        const isPasswordCorrect = await checkPassword(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("Invalid password");
            return res.status(400).json({ error: error.message });
        }

        user.password = await hashPassword(password);
        await user.save();

        res.send("password updated successfully");
    }

    static async checkCurrentUserPassword(req: Request, res: Response) {
        const { password } = req.body;
        const { id } = req.user;

        const user = await User.findByPk(id);
        const isPasswordCorrect = await checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("Invalid password");
            return res.status(400).json({ error: error.message });
        }

        res.send("correct password");
    }
}
