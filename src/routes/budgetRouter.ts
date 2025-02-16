import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetID } from "../middleware/budget";

const router = Router();
router.param("budgetId", validateBudgetID);
router.param("budgetId", validateBudgetExists);

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
router.get("/:budgetId", BudgetController.findById);
router.put(
    "/:budgetId",
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
router.delete("/:budgetId", BudgetController.delete);

export default router;
