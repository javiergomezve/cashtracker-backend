import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import {
    userHasAccessToBudget,
    validateBudgetExists,
    validateBudgetID,
    validateBudgetInput,
} from "../middleware/budget";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.param("budgetId", validateBudgetID);
router.param("budgetId", validateBudgetExists);
router.param("budgetId", userHasAccessToBudget);

router.param("expenseId", validateExpenseId);
router.param("expenseId", validateExpenseExists);

router.get("/", handleInputErrors, BudgetController.getAll);
router.post("/", validateBudgetInput, BudgetController.create);
router.get("/:budgetId", BudgetController.findById);
router.put("/:budgetId", validateBudgetInput, handleInputErrors, BudgetController.update);
router.delete("/:budgetId", BudgetController.delete);

// expenses routes

router.post("/:budgetId/expenses", validateExpenseInput, handleInputErrors, ExpenseController.store);
router.get("/:budgetId/expenses/:expenseId", handleInputErrors, ExpenseController.show);
router.put("/:budgetId/expenses/:expenseId", validateExpenseInput, handleInputErrors, ExpenseController.update);
router.delete("/:budgetId/expenses/:expenseId", handleInputErrors, ExpenseController.destroy);

export default router;
