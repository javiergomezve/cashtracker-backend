import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
            expense?: Expense;
        }
    }
}

export async function validateBudgetID(req: Request, res: Response, next: NextFunction) {
    await param("budgetId")
        .isInt()
        .withMessage("id is invalid")
        .custom((value) => value > 0)
        .withMessage("id is invalid")
        .run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

export async function validateBudgetExists(req: Request, res: Response, next: NextFunction) {
    try {
        const budget = await Budget.findByPk(req.params.budgetId);
        if (!budget) {
            const error = new Error("Budget not found");
            return res.status(404).json({ error: error.message });
        }

        req.budget = budget;
        next();
    } catch (e) {
        console.error("error: ", e);
        res.status(500).json({ error: "somenthing went wrong" });
    }
}

export async function validateBudgetInput(req: Request, res: Response, next: NextFunction) {
    await body("name").notEmpty().withMessage("Name is required").run(req);

    await body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid")
        .run(req);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

export async function userHasAccessToBudget(req: Request, res: Response, next: NextFunction) {
    if (req.budget.userId !== req.user.id) {
        const error = new Error("Invalid action");
        return res.status(401).json({ error: error.message });
    }

    next()
}
