import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetID } from "../middleware/budget";

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
router.get("/:id", validateBudgetID, BudgetController.findById);
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
    BudgetController.update,
);
router.delete("/:id", validateBudgetID, BudgetController.delete);

export default router;
