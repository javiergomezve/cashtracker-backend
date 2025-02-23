import type { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import Expense from "../models/Expense";

export async function validateExpenseInput(req: Request, res: Response, next: NextFunction) {
    await body("name").notEmpty().withMessage("Name is required").run(req);

    await body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid")
        .run(req);

    next();
}

export async function validateExpenseId(req: Request, res: Response, next: NextFunction) {
    await param("expenseId")
        .isInt()
        .custom((value) => value > 0)
        .withMessage("Invalid id")
        .run(req);

    next();
}

export async function validateExpenseExists(req: Request, res: Response, next: NextFunction) {
    try {
        const expense = await Expense.findByPk(req.params.expenseId);
        if (!expense) {
            const error = new Error("Expense not found");
            return res.status(404).json({ error: error.message });
        }

        req.expense = expense;
        next();
    } catch (e) {
        // console.error("error: ", e);
        res.status(500).json({ error: "something went wrong" });
    }
}
