import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";

async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold("Database connection success"));
    } catch (e) {
        console.error(colors.red.bold(`Error connecting to db: ${e}`));
    }
}

connectDB();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

export default app;
