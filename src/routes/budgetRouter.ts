import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetID, validateBudgetInput } from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseInput } from "../middleware/expense";

const router = Router();
router.param("budgetId", validateBudgetID);
router.param("budgetId", validateBudgetExists);

router.get("/", handleInputErrors, BudgetController.getAll);
router.post("/", validateBudgetInput, BudgetController.create);
router.get("/:budgetId", BudgetController.findById);
router.put("/:budgetId", validateBudgetInput, handleInputErrors, BudgetController.update);
router.delete("/:budgetId", BudgetController.delete);

// expenses routes

router.post("/:budgetId/expenses", validateExpenseInput, handleInputErrors, ExpenseController.store);
router.get("/:budgetId/expenses/:expenseId", ExpenseController.show);
router.put("/:budgetId/expenses/:expenseId", ExpenseController.update);
router.delete("/:budgetId/expenses/:expenseId", ExpenseController.destroy);

export default router;
