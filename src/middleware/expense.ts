import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

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
