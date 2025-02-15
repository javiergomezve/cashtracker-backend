import type { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";

export async function validateBudgetID(req: Request, res: Response, next: NextFunction) {
    await param("id")
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
