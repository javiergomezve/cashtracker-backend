import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetID } from "../middleware/budget";

const router = Router();

router.get("/", handleInputErrors, BudgetController.getAll);
router.post(
    "/",
    body("name").notEmpty().withMessage("Name is required"),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid"),
    BudgetController.create,
);
router.get("/:id", validateBudgetID, validateBudgetExists, BudgetController.findById);
router.put(
    "/:id",
    validateBudgetID,
    body("name").notEmpty().withMessage("Name is required"),
    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount invalid")
        .custom((value) => value > 0)
        .withMessage("Amount invalid"),
    handleInputErrors,
    validateBudgetExists,
    BudgetController.update,
);
router.delete("/:id", validateBudgetID, validateBudgetExists, BudgetController.delete);

export default router;
