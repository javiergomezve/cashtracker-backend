import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import budgetRouter from "./routes/budgetRouter";
import { authRouter } from "./routes/authRouter";
import { limiter } from "./config/limiter";

export async function connectDB() {
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
app.use(limiter);

app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/auth", authRouter);

export default app;
