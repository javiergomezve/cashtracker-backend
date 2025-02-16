import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetID, validateBudgetInput } from "../middleware/budget";

const router = Router();
router.param("budgetId", validateBudgetID);
router.param("budgetId", validateBudgetExists);

router.get("/", handleInputErrors, BudgetController.getAll);
router.post("/", validateBudgetInput, BudgetController.create);
router.get("/:budgetId", BudgetController.findById);
router.put("/:budgetId", validateBudgetInput, handleInputErrors, BudgetController.update);
router.delete("/:budgetId", BudgetController.delete);

export default router;
