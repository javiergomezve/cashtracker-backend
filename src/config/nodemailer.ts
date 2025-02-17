import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function config() {
    return {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    };
}

export const transport = nodemailer.createTransport(config());
