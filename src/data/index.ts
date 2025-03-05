import { exit } from "process";
import { db } from "../config/db";

async function clearDatabase() {
    try {
        await db.sync({ force: true });
        exit(0);
    } catch (e) {
        exit(1);
    }
}

if (process.argv[2] === "--clear") {
    clearDatabase();
}
