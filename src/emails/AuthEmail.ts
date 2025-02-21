import { transport } from "../config/nodemailer";
import { body } from "express-validator";

type SendConfirmationEmailInput = {
    firstName: string;
    email: string;
    token: string;
};

export class AuthEmail {
    static async sendConfirmationEmail(input: SendConfirmationEmailInput) {
        const email = await transport.sendMail({
            from: "CashTracker <admin@cashtracker.com>",
            to: input.email,
            subject: "CashTracker - Confirm your account",
            html: `
                <p>Hello ${input.firstName}</p>
                <p>Confirm your account with:
                    <a href="#">${input.token}</a>
                </p>
            `,
        });
    }

    static async sendResetPasswordToken(input: SendConfirmationEmailInput) {
        const email = await transport.sendMail({
            from: "CashTracker <admin@cashtracker.com>",
            to: input.email,
            subject: "CashTracker - Reset your password",
            html: `
                <p>Hello ${input.firstName}</p>
                <p>This is your token for reset your password:
                    <a href="#">${input.token}</a>
                </p>
            `,
        });
    }
}
